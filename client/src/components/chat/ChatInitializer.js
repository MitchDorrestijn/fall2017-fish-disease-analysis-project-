import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Senderbox from './Senderbox';
import Receiverbox from './Receiverbox';
import Infobox from './Infobox';
import MessageSender from './MessageSender';
import Videobox from './Videobox';
import * as firebase from 'firebase';

export default class ChatInitializer extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			chat: []
		}

		this.chatId = null;
		this.userId = null;
		this.admin = false;
		this.stream = null;
		
		this.initializeWebRTC();
	}
	
	componentDidMount = () => {
		//Setup webcam gebruiker
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		navigator.mediaDevices.getUserMedia({audio:true, video:true})
			.then((stream) => {
				document.getElementById("myCam").srcObject = stream;
				this.pc.addStream(stream);
				this.stream = stream;
			}).then(() => {
				this.checkAdmin();
				this.initializeDatabase();
				this.checkOnline();
				
				this.forceUpdate();
			});
	}
	
	checkAdmin = () => {
		//Controleer of de gebruiker een admin(consultant) is
		const url = window.location.href.replace(/\/$/, '');
		if(url.substr(url.lastIndexOf('/') + 1) !== "chat"){
			this.admin = true;
		}
	}
	
	initializeDatabase = () => {
		//Setup database ref
		if(this.admin){
			const url = window.location.href.replace(/\/$/, '');
			this.chatId = url.substr(url.lastIndexOf('/') + 1);
			this.userId = "admin";
		}else{
			if(firebase.auth().currentUser !== null){
				this.chatId = this.userId = firebase.auth().currentUser.uid;
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
			document.getElementById("otherCam").srcObject = event.stream
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
		this.sendMessage(this.userId, "checkOnline", "");
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
		this.pc.createOffer()
			.then(offer => this.pc.setLocalDescription(offer) )
			.then(() => this.sendMessage(this.userId, "offer", {'sdp': this.pc.localDescription}) );
	}
	
	sendChatMessage = (type, message) => {
		//Stuur chat bericht naar andere gebruiker
		if(this.dataChannel !== undefined){
			let messageObj = JSON.stringify({'type': type, 'data': message});
			this.dataChannel.send(messageObj);
			this.addSenderMessage(messageObj);
		}
	}
	
	addSenderMessage = (msg) => {
		let message = JSON.parse(msg);
		if(message.type === "text"){
			
			let chatMessages = this.state.chat;
			chatMessages.push(<Receiverbox key="0">{message.data}</Receiverbox>);
			this.setState({
				chat: chatMessages
			}, () => {
				document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
			});
			
		}else if(message.type === "image"){
			if(message.data === "open"){
				this.receivedImage = "";
			}else if(message.data === "close"){
				let chatMessages = this.state.chat;
				chatMessages.push(<Receiverbox key="0"><img className="img-fluid" src={this.receivedImage} alt="Send"/></Receiverbox>);
				this.setState({
					chat: chatMessages
				}, () => {
					setTimeout(() => {
						document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
					}, 100);
				});
			}else{
				this.receivedImage += message.data;
			}
		}
	}
	
	addReceiverMessage = (msg) => {
		let message = JSON.parse(msg);
		if(message.type === "text"){
			
			let chatMessages = this.state.chat;
			chatMessages.push(<Senderbox key="0">{message.data}</Senderbox>);
			this.setState({
				chat: chatMessages
			}, () => {
				document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
			});
			
		}else if(message.type === "image"){
			if(message.data === "open"){
				this.receivedImage = "";
			}else if(message.data === "close"){
				let chatMessages = this.state.chat;
				chatMessages.push(<Senderbox key="0"><img className="img-fluid" src={this.receivedImage} alt="Received"/></Senderbox>);
				this.setState({
					chat: chatMessages
				}, () => {
					setTimeout(() => {
						document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
					}, 100);
				});
			}else{
				this.receivedImage += message.data;
			}
		}
	}
	
	addInfoMessage = (msg) => {
		let chatMessages = this.state.chat;
		chatMessages.push(<Infobox key="0">{msg}</Infobox>);
		this.setState({
			chat: chatMessages
		}, () => {
			document.getElementById("chat-main").scrollTop = document.getElementById("chat-main").scrollHeight;
		});
	}
	
	closeConnection = () => {
		this.sendMessage(this.userId, "closeConnection", "");
		this.pc.close();
		this.pc = null;
		this.addInfoMessage("De verbinding is verbroken");
		this.initializeWebRTC();
		this.pc.addStream(this.stream);
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
				
				this.addInfoMessage("De chat is gestart");
			}else if (type === "answer"){
				//Andere gebruiker heeft een answer gestuurd op de offer
				this.pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
				this.addInfoMessage("De chat is gestart");
			}else if(type === "checkOnline"){
				//Andere gebruiker vraagt of de gebruiker online is, stuur een antwoord terug
				this.sendMessage(this.userId, "checkOnlineAnswer", "");
			}else if(type === "checkOnlineAnswer"){
				//Andere gebruiker heeft gereageerd op de vraag of er iemand online is
				this.setupStreamOther();
			}else if(type === "closeConnection"){
				//Andere gebruiker heeft de connectie verbroken
				this.pc.close();
				this.pc = null;
				this.addInfoMessage("De verbinding is verbroken");
				this.initializeWebRTC();
				this.pc.addStream(this.stream);
			}
		}
	}
	
	render(){
		return (
				<div id="chat-main" className="chat-wrapper">
					<Container>
						<Row>
							<Col md="8">
								<h3>ChatId: {''+this.chatId}</h3>
								{/*<br/>Is consultant: {''+this.admin}</h3>*/}
								<div id="chatBox">
									{this.state.chat}
								</div>
								<MessageSender sendChatMessage={this.sendChatMessage} />
							</Col>
							<Col md="4">
								<Videobox closeConnection={this.closeConnection} stream={this.stream} checkOnline={this.checkOnline} />
							</Col>
						</Row>
					</Container>
				</div>
		);
	}
};
