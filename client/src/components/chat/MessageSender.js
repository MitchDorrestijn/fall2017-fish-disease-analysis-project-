import React from 'react';
import {
	Form,
	Input,
	InputGroup,
	InputGroupButton,
	InputGroupAddon,
	UncontrolledTooltip,
	Col
	} from 'reactstrap';

export default class MessageSender extends React.Component {
	getTextMessage = (e) => {
		e.preventDefault();
		const messageEl = document.getElementById('messageToSend');
		const uploadEl = document.getElementById('fileUpload');
		if(messageEl.value !== "" || uploadEl.files[0] !== undefined){
			if(uploadEl.files[0] === undefined){
				const message = messageEl.value;
				messageEl.value = "";
				this.props.sendChatMessage("text", {"name": this.props.name, "message": message});
			}else{
				if (uploadEl.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)){
					this.sendImage(uploadEl.files[0]);
					uploadEl.value = "";
					this.handleFileChange();
				}
			}
		}
	}
	
	handleFileChange = () => {
		const messageEl = document.getElementById("messageToSend");
		const uploadEl = document.getElementById("fileUpload");
		const buttonEl = document.getElementById("sendButton");
		const removeEl = document.getElementById("removeImage");
		if(uploadEl.files[0] === undefined){
			messageEl.value = "";
			messageEl.disabled = false;
			buttonEl.innerHTML = "Send message";
			removeEl.style.visibility = "hidden";
		}else{
			messageEl.value = uploadEl.files[0].name;
			messageEl.disabled = true;
			buttonEl.innerHTML = "Send image";
			removeEl.style.visibility = "visible";
		}
	}
	
	deleteImage = () => {
		document.getElementById("fileUpload").value = "";
		this.handleFileChange();
	}
	
	sendImage = (file) => {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			this.props.sendChatMessage("image", {"name": this.props.name, "message": "open"});
		
			const CHUNK_LENGTH = 60000;
			const len = Math.floor(reader.result.length / CHUNK_LENGTH);
			
			if(len === 0){
				this.props.sendChatMessage("image", {"name": this.props.name, "message": reader.result});
			}else{
				for(let i = 0; i < len; i++){
					this.props.sendChatMessage("image", {"name": this.props.name, "message": reader.result.substring((CHUNK_LENGTH*i), (CHUNK_LENGTH*(i+1)))});
				}
				this.props.sendChatMessage("image", {"name": this.props.name, "message": reader.result.substring((CHUNK_LENGTH*len), reader.result.length)});
			}
			
			this.props.sendChatMessage("image", {"name": this.props.name, "message": "close"});
		};
	}

	render(){
  	return (
			<Col className="footer fixed-bottom" sm="12" md="12">
				<Col sm="12" md={{ size: 8, offset: 1 }}>
					<Form onSubmit={(e) => this.getTextMessage(e)}>
						<InputGroup>
							<span className="removeImage" id="removeImage" onClick={() => this.deleteImage()}><i className="fa fa-times "/></span>
							<UncontrolledTooltip placement="top" target="removeImage">
								Click to delete image
							</UncontrolledTooltip>
							<InputGroupAddon className="fileUpload-wrapper">
								<label htmlFor="fileUpload">
									<i className="fa fa-picture-o "/>
								</label>
								<input id="fileUpload" type="file" onChange={() => this.handleFileChange()}/>
							</InputGroupAddon>
							<Input type="text" className="messageToSend" id="messageToSend" placeholder="Type your message" />
							<InputGroupButton className="sendButton" id="sendButton" color="dark">Send message</InputGroupButton>
						</InputGroup>
					</Form>
				</Col>
			</Col>
  	);
	}
}
