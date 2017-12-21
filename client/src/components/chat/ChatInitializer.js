import React from 'react';
import { Container, Row, Col, Progress } from 'reactstrap';
import Senderbox from './Senderbox';
import Receiverbox from './Receiverbox';
import Infobox from './Infobox';
import MessageSender from './MessageSender';
import Videobox from './Videobox';
import VideoboxMobile from './VideoboxMobile';
import * as firebase from 'firebase';

export default class ChatInitializer extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			chat: []
		}

		this.chatId = null;
		this.userId = null;
		this.name = "";
		this.pageAdmin = false;
		this.stream = null;
		
		this.initializeWebRTC();
	}
	
	componentDidMount = () => {
		//Setup webcam gebruiker
		this.checkAdmin();
		this.initializeDatabase();
		this.checkOnline();
	}
	
	checkAdmin = () => {
		//Controleer of de gebruiker een admin(consultant) is
		const url = window.location.href.replace(/\/$/, '');
		if(url.substr(url.lastIndexOf('/') + 1) !== "chat"){
			this.pageAdmin = true;
		}
	}
	
	initializeDatabase = () => {
		//Setup database ref en een aantal variablen
		if(this.pageAdmin){
			if(this.props.isAdmin){
				const url = window.location.href.replace(/\/$/, '');
				this.chatId = url.substr(url.lastIndexOf('/') + 1);
				this.userId = "admin";
				this.name = "Consultant";
			}else{
				this.addInfoMessage("Niet ingelogd als administrator");
			}
		}else{
			if(this.props.loggedIn){
				this.chatId = this.userId = firebase.auth().currentUser.uid;
				this.name = firebase.auth().currentUser.displayName;
			}else{
				this.addInfoMessage("U bent niet ingelogd");
			}
		}
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
		
		this.pc.onaddstream = (event) => {
			const camEl = document.getElementsByClassName("otherCam");
			for(let i = 0; i < camEl.length; i++){
				camEl[i].srcObject = event.stream;
			}
		};
		
		this.pc.ondatachannel = (event) => {
			this.dataChannel = event.channel;
			this.dataChannel.onmessage = (event) => { 
				this.addReceiverMessage(event.data);
			};
		};
	}
	
	checkOnline = () => {
		//Controleer of er een gebruiker online is in deze chatruimte
		if(firebase.auth().currentUser !== null){
			if(this.pageAdmin && this.props.isAdmin){
				this.sendMessage(this.userId, "checkOnline", "");
			}else{
				this.sendMessage(this.userId, "checkOnline", "");
			}
		}
	}
	
	setupDataChannel = () => {
		//Setup de datachannel verbinding
		let dataChannelOptions = { 
			reliable:true 
		};
		this.dataChannel = this.pc.createDataChannel(this.chatId, dataChannelOptions);
		this.dataChannel.onmessage = (event) => { 
			this.addReceiverMessage(event.data);
		};
	}
	
	setupStreamOther = () => {
		//Setup webcam andere gebruiker en de datachannel
		this.setupDataChannel();
		this.createOffer();
	}
	
	createOffer = () => {
		//Stuur een connection offer
		this.pc.createOffer()
			.then(offer => this.pc.setLocalDescription(offer) )
			.then(() => this.sendMessage(this.userId, "offer", {'sdp': this.pc.localDescription}) );
	}
	
	startWebcam = () => {
		//Start de webcam stream en voeg hem toe aan de connection
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		navigator.mediaDevices.getUserMedia({audio:true, video:true})
		.then((stream) => {
			const camEl = document.getElementsByClassName("myCam");
			for(let i = 0; i < camEl.length; i++){
				camEl[i].srcObject = stream;
			}
			this.stream = stream;
			this.pc.addStream(stream);
			this.createOffer();
			this.forceUpdate();
		}).catch((err) => {
			this.addInfoMessage("Geen webcam aangesloten of geen toestemming gegeven");
		});
	}
	
	stopWebcam = () => {
		//Stop de webcam stream
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
	
	//Communicatie	
	sendChatMessage = (type, message, id, current, total) => {
		//Stuur chat bericht naar andere gebruiker
		if(this.dataChannel !== undefined){
			let messageObj;
			if(type === "text"){
				messageObj = JSON.stringify({'type': type, 'data': message});
			}else{
				messageObj = JSON.stringify({'type': type, 'id': id, 'progress': {'current': current, 'total': total}, 'data': message});
			}
			this.dataChannel.send(messageObj);
			this.addSenderMessage(messageObj);
		}
	}
	
	addSenderMessage = (msg) => {
		//Voeg het verzonden bericht toe
		let message = JSON.parse(msg);
		if(message.type === "text"){
			let chatMessages = this.state.chat;
			chatMessages.push(<Receiverbox name={message.data.name} key="0">{message.data.message}</Receiverbox>);
			this.setState({
				chat: chatMessages
			}, () => {
				setTimeout(() => {
					document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
				}, 100);
			});
			
		}else{
			if(message.data.state === "open"){
				this.sendFile = "";
			}else if(message.data.state === "close"){
				let chatMessages = this.state.chat;
				if(message.type === "image"){
					chatMessages.push(<Receiverbox name={message.data.name} key="0">{message.data.message?<p>{message.data.message}</p>:null}<img className="img-fluid" src={this.sendFile} alt="Received"/></Receiverbox>);
				}else if(message.type === "video"){
					chatMessages.push(<Receiverbox name={message.data.name} key="0">{message.data.message?<p>{message.data.message}</p>:null}<video className="chatVideo" src={this.sendFile} controls></video></Receiverbox>);
				}
				this.setState({
					chat: chatMessages
				}, () => {
					setTimeout(() => {
						document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
					}, 100);
				});
			}else{
				this.sendFile += message.data.message;
			}
		}
	}
	
	addReceiverMessage = (msg) => {
		//Voeg het ontvangen bericht toe
		let message = JSON.parse(msg);
		if(message.type === "text"){
			
			let chatMessages = this.state.chat;
			chatMessages.push(<Senderbox name={message.data.name} key="0">{message.data.message}</Senderbox>);
			this.setState({
				chat: chatMessages
			}, () => {
				setTimeout(() => {
					document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
				}, 100);
			});
			
		}else{
			if(message.data.state === "open"){
				this.receivedFile = "";
				let chatMessages = this.state.chat;
				chatMessages.push(<Senderbox name={message.data.name} key="0">{message.data.message?<p>{message.data.message}</p>:null}<Progress animated id={"progressBar_" + message.id} value={100}/></Senderbox>);
				this.setState({
					chat: chatMessages
				}, () => {
					setTimeout(() => {
						document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
					}, 100);
					document.getElementById("progressBar_" + message.id).style.width = 0;
				});
			}else if(message.data.state === "close"){
				const barEl = document.getElementById("progressBar_" + message.id);
				const parentBarEl = document.getElementById("progressBar_" + message.id).parentNode;
				parentBarEl.removeChild(barEl);
				if(message.type === "image"){
					let imgEl = document.createElement("img");
					imgEl.className = "img-fluid";
					imgEl.src = this.receivedFile;
					imgEl.alt = "Received";
					parentBarEl.appendChild(imgEl);
				}else if(message.type === "video"){
					let videoEl = document.createElement("video");
					videoEl.className = "chatVideo";
					videoEl.src = this.receivedFile;
					videoEl.setAttribute("controls","controls");
					parentBarEl.appendChild(videoEl);
				}
				setTimeout(() => {
					document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
				}, 100);
			}else{
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
		//Plaats een bericht op de database en verwijder hem daarna weer
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
			}else if(type === "checkOnline"){
				//Andere gebruiker vraagt of de gebruiker online is, stuur een antwoord terug
				if(this.pc !== undefined){
					this.pc.close();
					this.pc = null;
					this.initializeWebRTC();
					if(this.stream !== null){
						this.stopWebcam();
					}
				}
				this.sendMessage(this.userId, "checkOnlineAnswer", "");
				this.addInfoMessage("De chat is gestart");
			}else if(type === "checkOnlineAnswer"){
				//Andere gebruiker heeft gereageerd op de vraag of er iemand online is
				this.setupStreamOther();
				this.addInfoMessage("De chat is gestart");
			}
		}
	}
	
	render(){
		return (
				<div id="chat-main" className="chat-wrapper">
					<Container>
						<Row>
							<VideoboxMobile startWebcam={this.startWebcam} stopWebcam={this.stopWebcam} stream={this.stream} />
						</Row>
						<Row className="inner-chat-wrapper">
							<Col md="8">
								<div id="chatBox">
									{this.state.chat}
								</div>
								<MessageSender name={this.name} sendChatMessage={this.sendChatMessage} />
							</Col>
							<Col md="4" className="removeColumn">
								<Videobox startWebcam={this.startWebcam} stopWebcam={this.stopWebcam} stream={this.stream} />
							</Col>
						</Row>
					</Container>
				</div>
		);
	}
};
