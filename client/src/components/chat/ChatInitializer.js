import React from 'react';
import { Container, Row, Col, Progress } from 'reactstrap';
import Senderbox from './Senderbox';
import Receiverbox from './Receiverbox';
import Infobox from './Infobox';
import MessageSender from './MessageSender';
import Videobox from './Videobox';
import VideoboxMobile from './VideoboxMobile';
import DataAccess from '../../scripts/DataAccess';
import * as firebase from 'firebase';

export default class ChatInitializer extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			chat: [],
			chatStatus: false,
			appointmentStatus: false
		}

		this.chatId = null;
		this.userId = null;
		this.name = "";
		this.stream = null;
		this.interval = null;
		this.checkIfOnline = false;
		this.appointment = null;
		
		this.initializeWebRTC();
	}
	
	componentDidMount = () => {
		//Start de validatie
		this.validateChat();
	}
	
	componentWillUnmount = () => {
		//Verwijder de interval bij het verlaten van de component als deze aan staat
		if(this.interval !== null){
			clearInterval(this.interval);
		}
		if(this.pc !== undefined && this.pc !== null){
			this.stopWebcam();
			this.pc.close();
			this.pc = null;
		}
	}
	
	validateChat = () => {
		//Alle validatie wordt hier gedaan. Als alles goed is dan worden de variables ingevuld en word de verbinding gestart.
		
		//Haal de appointmentId uit de URL d.m.v. de string op te halen na de laatste / in de URL
		const url = window.location.href.replace(/\/$/, '');
		const appointmentId = url.substr(url.lastIndexOf('/') + 1);
		
		//Controleer of de string na de laatste / in de URL niet gelijk is aan chat of admin, is dit wel het geval betekend dit dat er geen ID in de URL staat
		if(appointmentId !== "chat" && appointmentId !== "admin"){
			//Haal de appointment op met het ID in de URL
			let da = new DataAccess ();
			da.getData ('/appointments/' + appointmentId, (err, res) => {
				//Als er een error is dan bestaat de appointment niet
				if(!err){
					const appointment = res.message;
					this.appointment = appointment;
					
					//Kijk of de gebruiker de pagina als admin of gebruiker wilt weergeven(/chat/:id is gebruiker, /chat/admin/:id is admin)
					if(this.props.adminPage){
						//Controleer of de ingelogde gebruiker is ingelogd/een admin is
						if(this.props.isAdmin){
							this.showAppointmentInfo(appointment);
							
							//Zet appointment status
							this.setState({
								appointmentStatus: appointment.status
							});
							
							//Controleer of de appointment status open is.
							if(appointment.status){
								//Zet de benodigde variablen en start de functies om de chat te starten
								this.chatId = appointmentId;
								this.userId = "admin";
								this.name = "Consultant";
								
								this.initializeDatabase();
								this.showTodaysData(appointment);
								this.startConnection();
							}else{
								this.props.showFeedback("danger", "This chat session is closed. It is not possible to start a connection while the session is closed. You have to reopen the session to start a connection.");
							}
						}else{
							this.props.showFeedback("danger", "You are not logged in as an administrator.");
						}
					}else{
						//Controleer of de ingelogde gebruiker is ingelogd
						if(this.props.loggedIn){
							this.userId = firebase.auth().currentUser.uid;
							//Controleer of de gebruiker die ingelogd is de gebruiker is die de appointment heeft aangevraagd
							if(this.userId === appointment.reservedBy){
								//Controleer of de appointment status open is
								if(appointment.status){
									//Zet de benodigde variablen en start de functies om de chat te starten
									this.chatId = appointmentId;
									this.userId = firebase.auth().currentUser.uid;
									this.name = firebase.auth().currentUser.displayName;
									
									this.showAppointmentInfo(appointment);
									this.initializeDatabase();
									this.startConnection();
								}else{
									this.props.showFeedback("danger", "This chat session is closed.");
								}
							}else{
								this.props.showFeedback("danger", "This chat session does not belong to this account.");
							}
						}else{
							this.props.showFeedback("danger", "You are not logged in.");
						}
					}
				}else{
					this.props.showFeedback("danger", "There is no appointment registered with the given ID.");
				}
			});
		}
	}
	
	showAppointmentInfo = (appointment) => {
		//Haal dmv een GET request gegevens op over het timeslot van de appointment die word meegegeven en voeg daarna een info bericht toe aan de chat.
		let da = new DataAccess ();
		da.getData ('/timeslots/' + appointment.timeslotId, (err, res) => {
			if (!err) {
				const timeslot = res.message;
				const appointmentTime = timeslot.startDate.substring(0, 10) + " from " + timeslot.startDate.substring(11, 16) + " till " + timeslot.endDate.substring(11, 16) + " UTC+1";
				this.addInfoMessage("Appointment information:\n - Time: " + appointmentTime + "\n - Your appointment description: " + appointment.comment);
			} else {
				console.log(err.message);
			}
		});
	}
	
	showTodaysData = (appointment) => {
		//Laat de laatste entries zien van today's data van de gebruiker die de appointment heeft aangevraagd
		let da = new DataAccess ();
		da.getData ('/user/' + appointment.reservedBy + '/aquaria', (err, res) => {
			if (!err) {
				res.message.forEach((aquarium) => {
					if(aquarium.entries.length !== 0){
						const data = aquarium.entries[0];

						let message = "Latest data from aquarium: " + aquarium.name + ". ";
								
						for (let key in data) {
							if (data.hasOwnProperty(key)) {
								if(key !== "Date" && key !== "createdAt"){
									message += key + ": " + data[key] + ", ";
								}
							}
						}
						message = message.slice(0, -2);
						this.addInfoMessage(message);
					}
				});
			} else {
				console.log(err.message);
			};
		});
	}
	
	initializeDatabase = () => {
		//Setup database ref en een event handler. Als er een bericht binnen komt op die database ref dan word de functie this.readMessage uitgevoerd
		this.database = firebase.database().ref('/chat/' + this.chatId);
		this.database.on('child_added', this.readMessage);
	}
	
	initializeWebRTC = () => {
		//Zet alle variabelen die nodig zijn voor een WebRTC verbinding
		this.servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': '123456','username': 'coen_severein@hotmail.com'}]};
		this.pc = new RTCPeerConnection(this.servers);	
		this.pc.onicecandidate = (event) => {
			event.candidate&&this.sendMessage(this.userId, "ice", {'ice': event.candidate})
		};
		
		//Als er een stream(webcam beeld) wordt toegevoegd door de andere gebruiker dan wordt deze in het video element gestopt.
		this.pc.onaddstream = (event) => {
			const camEl = document.getElementsByClassName("otherCam");
			for(let i = 0; i < camEl.length; i++){
				camEl[i].srcObject = event.stream;
			}
		};
		
		//Als er een datachannel wordt geopend dan wordt deze globaal opgeslagen
		this.pc.ondatachannel = (event) => {
			this.dataChannel = event.channel;
			//Als er een bericht binnenkomt over de datachannel dan wordt deze hier afgehandeld
			this.dataChannel.onmessage = (event) => {
				//Controleer of het binnengekomen bericht een nieuw bericht is of een bevesting dat er een chunck van een foto/video is binnengekomen bij de andere gebruiker
				if(JSON.parse(event.data).type === "confirmImage" || JSON.parse(event.data).type === "confirmVideo"){
					this.addSenderMessage(event.data);
				}else{
					this.addReceiverMessage(event.data);
				}
			};
		};
	}
	
	startConnection = () => {
		//Controleer of er een gebruiker online is in deze chatruimte
		this.sendMessage(this.userId, "startConnection", "");
	}
	
	setupStreamOther = () => {
		//Setup webcam andere gebruiker en de datachannel
		this.setupDataChannel();
		this.createOffer();
	}
	
	setupDataChannel = () => {
		//Setup de datachannel verbinding en sla deze vervolgens globaal op
		let dataChannelOptions = { 
			reliable:true 
		};
		this.dataChannel = this.pc.createDataChannel(this.chatId, dataChannelOptions);
		//Als er een bericht binnenkomt over de datachannel dan wordt deze hier afgehandeld
		this.dataChannel.onmessage = (event) => {
			//Controleer of het binnengekomen bericht een nieuw bericht is of een bevesting dat er een chunck van een foto/video is binnengekomen bij de andere gebruiker
			if(JSON.parse(event.data).type === "confirmImage" || JSON.parse(event.data).type === "confirmVideo"){
				this.addSenderMessage(event.data);
			}else{
				this.addReceiverMessage(event.data);
			}
		};
	}
	
	createOffer = () => {
		//Stuur een connection offer
		this.pc.createOffer()
			.then(offer => this.pc.setLocalDescription(offer) )
			.then(() => this.sendMessage(this.userId, "offer", {'sdp': this.pc.localDescription}) );
	}
	
	checkOnline = () => {
		//Om de 5 seconde wordt gekeken of er een reactie is binnen gekomen op de vraag of de andere gebruiker nog steeds online is
		this.interval = setInterval(() => {
			//If true dan wordt de vraag opnieuw verstuurd, if false dan is de andere gebruiker niet meer op de chat pagina en wordt alles stopgezet
			if(this.checkIfOnline){
				this.sendMessage(this.userId, "checkOnline", "");
				this.checkIfOnline = false;
			}else{
				if(this.interval !== null){
					clearInterval(this.interval);
				}
				if(this.pc !== undefined  && this.pc !== null){
					this.setState({
						chatStatus: false
					});
					this.stopWebcam();
					this.pc.close();
					this.pc = null;
					this.initializeWebRTC();
					this.addInfoMessage("The other user left this chat session.");
				}
			}
		}, 5000);
	}
	
	startWebcam = () => {
		//Start de webcam stream en voeg hem toe aan de connection
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		navigator.mediaDevices.getUserMedia({audio:true, video:true})
		.then((stream) => {
			//Voeg hem aan eigen video toe
			const camEl = document.getElementsByClassName("myCam");
			for(let i = 0; i < camEl.length; i++){
				camEl[i].srcObject = stream;
			}
			//Voeg de stream aan de verbinding toe
			this.stream = stream;
			this.pc.addStream(stream);
			this.createOffer();
			this.forceUpdate();
		}).catch((err) => {
			this.addInfoMessage("There is no webcam connected to this device or there is no permission granted to use the webcam");
		});
	}
	
	stopWebcam = () => {
		//Stop de webcam stream
		if(this.stream !== null){
			this.stream.getAudioTracks().forEach(function(track) {
				track.stop();
			});
			this.stream.getVideoTracks().forEach(function(track) {
				track.stop();
			});
			this.pc.removeStream(this.stream);
			this.stream = null;
			
			const camEl = document.getElementsByClassName("myCam");
			for(let i = 0; i < camEl.length; i++){
				camEl[i].removeAttribute("src");
				camEl[i].load();
			}
			
			this.forceUpdate();
		}
	}
	
	closeChat = () => {
		//Sluit de chat(Alleen door de consultant). Stuur een bericht naar de gebruiker dat de chat gesloten is zodat hij/zij hiervan op de hoogte
		//word gesteld. Bij de gebruiker verschijnt er een bericht en het invoerveld word uitgeschakeld.
		this.sendMessage(this.userId, "closeChat", "");
		this.setState({
			chatStatus: false,
			appointmentStatus: false
		});
		this.stopWebcam();
		this.pc.close();
		this.pc = null;
		
		//Update de appointment status
		if(this.appointment !== null){
			let da = new DataAccess ();
			da.putData ('/admin/appointments/' + this.appointment.id, {appointment: {status: false, timeslotId: this.appointment.timeslotId}}, (err, res) => {
				if (err) {
					console.log(err.message);
				}
			});
		}
		
		this.addInfoMessage("The chat is now closed.");
	}
	
	//Communicatie	
	sendChatMessage = (type, message, id, current, total) => {
		//Stuur chat bericht naar andere gebruiker
		if(this.dataChannel !== undefined){
			let messageObj;
			if(type === "text"){
				messageObj = JSON.stringify({'type': type, 'data': message});
				this.addSenderMessage(messageObj);
			}else{
				messageObj = JSON.stringify({'type': type, 'id': id, 'progress': {'current': current, 'total': total}, 'data': message});
			}
			this.dataChannel.send(messageObj);
		}
	}
	
	addChatLog = (message) => {
		//Voeg het bericht toe aan de chatlog van de appointment
		let da = new DataAccess ();
		da.postData('/appointments/' + this.chatId + '/chatlogs', {chatLog: message}, (err, res) => {
			if (err) {
				console.log(err.message);
			};
		});
	}
	
	giveTime = () => {
		//Geef de huidige tijd
		let currentDate = new Date();
		return currentDate.getHours() + ":" + ('0' + currentDate.getMinutes()).slice(-2);
	}
	
	addSenderMessage = (msg) => {
		//Voeg het verzonden bericht toe
		let message = JSON.parse(msg);
		if(message.type === "text"){
			//Voeg text bericht toe aan de chat
			let chatMessages = this.state.chat;
			chatMessages.push(<Senderbox name={this.giveTime() + " " + message.data.name} key="0">{message.data.message}</Senderbox>);
			this.setState({
				chat: chatMessages
			}, () => {
				document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
			});
			
			//Voeg bericht toe aan chatlog van de appointment
			this.addChatLog({'time': this.giveTime(), 'userId': this.userId, 'name': message.data.name, 'message': message.data.message});
		}else{
			//Voeg media bericht toe aan de chat
			if(message.data.state === "open"){
				//Eerste bericht bij het versturen van een media bestand
				this.sendFile = "";
				let chatMessages = this.state.chat;
				chatMessages.push(<Senderbox name={this.giveTime() + " " + message.data.name} key="0">{message.data.message?<p>{message.data.message}</p>:null}<Progress animated id={"progressBar_" + message.id} value={100}/></Senderbox>);
				this.setState({
					chat: chatMessages
				}, () => {
					document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
					document.getElementById("progressBar_" + message.id).style.width = 0;
				});
				
				//Voeg bericht toe aan chatlog van de appointment
				this.addChatLog({'time': this.giveTime(), 'userId': this.userId, 'name': message.data.name, 'message': "[Media file] " + message.data.message});
			}else if(message.data.state === "close"){
				//Laatste bericht bij het versturen van een media bestand
				
				//Verwijder progress bar
				const barEl = document.getElementById("progressBar_" + message.id);
				const parentBarEl = document.getElementById("progressBar_" + message.id).parentNode;
				parentBarEl.removeChild(barEl);
				
				if(message.type === "image" || message.type === "confirmImage"){
					//Voeg image toe aan bericht
					let imgEl = document.createElement("img");
					imgEl.className = "img-fluid";
					imgEl.src = this.sendFile;
					imgEl.alt = "Received";
					parentBarEl.appendChild(imgEl);
				}else if(message.type === "video" || message.type === "confirmVideo"){
					//Voeg video toe aan bericht
					let videoEl = document.createElement("video");
					videoEl.className = "chatVideo";
					videoEl.src = this.sendFile;
					videoEl.setAttribute("controls","controls");
					parentBarEl.appendChild(videoEl);
				}
				
				document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
			}else{
				//Chunk van media bestand, voeg hem toe aan verzonden bestand en update de progress bar
				this.sendFile += message.data.message;
				
				document.getElementById("progressBar_" + message.id).style.width = Math.floor((100 / message.progress.total) * message.progress.current) + '%';
			}
		}
	}
	
	addReceiverMessage = (msg) => {
		//Voeg het ontvangen bericht toe
		let message = JSON.parse(msg);
		if(message.type === "text"){
			//Voeg text bericht toe aan de chat
			let chatMessages = this.state.chat;
			chatMessages.push(<Receiverbox name={this.giveTime() + " " + message.data.name} key="0">{message.data.message}</Receiverbox>);
			this.setState({
				chat: chatMessages
			}, () => {
				document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
			});
			
		}else{
			//Voeg media bericht toe aan de chat
			
			//Stuur een bericht terug naar de verzender dat de chunck van het verzonden bestand ontvangen is
			if(message.type === "image"){
				this.sendChatMessage("confirmImage", message.data, message.id, message.progress.current, message.progress.total);
			}else if(message.type === "video"){
				this.sendChatMessage("confirmVideo", message.data, message.id, message.progress.current, message.progress.total);
			}
			if(message.data.state === "open"){
				//Eerste bericht bij het ontvangen van een media bestand
				this.receivedFile = "";
				let chatMessages = this.state.chat;
				chatMessages.push(<Receiverbox name={this.giveTime() + " " + message.data.name} key="0">{message.data.message?<p>{message.data.message}</p>:null}<Progress animated id={"progressBar_" + message.id} value={100}/></Receiverbox>);
				this.setState({
					chat: chatMessages
				}, () => {
					document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
					document.getElementById("progressBar_" + message.id).style.width = 0;
				});
			}else if(message.data.state === "close"){
				//Laatste bericht bij het versturen van een media bestand
				
				//Verwijder progress bar
				const barEl = document.getElementById("progressBar_" + message.id);
				const parentBarEl = document.getElementById("progressBar_" + message.id).parentNode;
				parentBarEl.removeChild(barEl);
				
				if(message.type === "image"){
					//Voeg image toe aan bericht
					let imgEl = document.createElement("img");
					imgEl.className = "img-fluid";
					imgEl.src = this.receivedFile;
					imgEl.alt = "Received";
					parentBarEl.appendChild(imgEl);
				}else if(message.type === "video"){
					//Voeg video toe aan bericht
					let videoEl = document.createElement("video");
					videoEl.className = "chatVideo";
					videoEl.src = this.receivedFile;
					videoEl.setAttribute("controls","controls");
					parentBarEl.appendChild(videoEl);
				}
				
				document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
			}else{
				//Chunk van media bestand, voeg hem toe aan verzonden bestand en update de progress bar
				this.receivedFile += message.data.message;
				
				document.getElementById("progressBar_" + message.id).style.width = Math.floor((100 / message.progress.total) * message.progress.current) + '%';
			}
		}
	}
	
	addInfoMessage = (msg) => {
		//Voeg een info bericht toe
		let chatMessages = this.state.chat;
		chatMessages.push(<Infobox key="0">{msg}</Infobox>);
		this.setState({
			chat: chatMessages
		}, () => {
			document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
		});
	}
	
	sendMessage = (senderId, type, data) => {
		//Plaats een bericht op de database en verwijder hem daarna weer zodat de andere gebruiker deze kan uitlezen
		let msg = this.database.push({ sender: senderId, message: JSON.stringify({'type': type, 'data': data}) });
		msg.remove();
	}
	
	readMessage = (data) => {
		//Als er een bericht is geplaatst is op de database wordt deze hier uitgelezen
		let msg = JSON.parse(data.val().message).data;
		let type = JSON.parse(data.val().message).type;
		let sender = data.val().sender;
		if (sender !== this.userId) {
			if (type === "ice"){
				this.pc.addIceCandidate(new RTCIceCandidate(msg.ice));
			}else if (type === "offer" && this.chatId !== null){
				//Andere gebruiker heeft een offer gestuurd, antwoord met een answer
				this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
					.then(() => this.pc.createAnswer())
					.then(answer => this.pc.setLocalDescription(answer))
					.then(() => this.sendMessage(this.userId, "answer", {'sdp': this.pc.localDescription}))
					.then(() => this.setupDataChannel());
			}else if (type === "answer"){
				//Andere gebruiker heeft een answer gestuurd op de offer
				this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
			}else if(type === "startConnection"){
				//Andere gebruiker vraagt of de gebruiker klaar is om de chat te starten
				if(this.pc !== undefined && this.pc !== null){
					this.stopWebcam();
					this.pc.close();
					this.pc = null;
					this.initializeWebRTC();
				}
				this.sendMessage(this.userId, "startConnectionAnswer", "");
				this.checkIfOnline = true;
				this.checkOnline();
				this.addInfoMessage("The chat has been started.");
				this.setState({
					chatStatus: true
				});
			}else if(type === "startConnectionAnswer"){
				//Andere gebruiker heeft gereageerd op de vraag of hij klaar is om een chat te starten
				this.setupStreamOther();
				this.addInfoMessage("The chat has been started.");
				this.checkIfOnline = true;
				this.checkOnline();
				this.setState({
					chatStatus: true
				});
			}else if(type === "checkOnline"){
				//Andere gebruiker vraagt of de gebruiker online is, stuur een antwoord terug
				this.sendMessage(this.userId, "checkOnlineAnswer", "");
			}else if(type === "checkOnlineAnswer"){
				//Andere gebruiker heeft gereageerd op de vraag of er iemand online is
				this.checkIfOnline = true;
			}else if(type === "closeChat"){
				//Consultant heeft de chat gesloten. Peer connection wordt gesloten en invoerveld wordt disabled
				this.addInfoMessage("The chat is closed by the consultant.");
				if(this.pc !== undefined && this.pc !== null){
					this.setState({
						chatStatus: false
					});
					this.stopWebcam();
					this.pc.close();
					this.pc = null;
				}
			}
		}
	}
	
	render(){
		return (
				<div id="chat-main" className="chat-wrapper">
					<Container>
						<Row>
							<VideoboxMobile startWebcam={this.startWebcam} stopWebcam={this.stopWebcam} chatStatus={this.state.chatStatus} appointmentStatus={this.state.appointmentStatus} closeChat={this.closeChat} adminPage={this.props.adminPage} stream={this.stream} />
						</Row>
						<Row className="inner-chat-wrapper">
							<Col md="4" className="removeColumn">
								<Videobox type='other' startWebcam={this.startWebcam} chatStatus={this.state.chatStatus} appointmentStatus={this.state.appointmentStatus} closeChat={this.closeChat} stopWebcam={this.stopWebcam} adminPage={this.props.adminPage} stream={this.stream} />
							</Col>

							<Col md="6">
								<div id="chatBox">
									{this.state.chat}
								</div>
								<MessageSender name={this.name} chatStatus={this.state.chatStatus} showFeedback={this.props.showFeedback} sendChatMessage={this.sendChatMessage} />
							</Col>
							<Col md="2" className="removeColumn">
								<Videobox type='you' startWebcam={this.startWebcam} chatStatus={this.state.chatStatus} appointmentStatus={this.state.appointmentStatus} closeChat={this.closeChat} stopWebcam={this.stopWebcam} adminPage={this.props.adminPage} stream={this.stream} />
							</Col>

						</Row>
					</Container>
				</div>
		);
	}
};
