import React from 'react';
import { Col } from 'reactstrap';
import { Button, Form, FormGroup, Input } from 'reactstrap';

export default class MessageSender extends React.Component {
	getTextMessage = (e) => {
		e.preventDefault();
		const messageEl = document.getElementById('messageToSend');
		const uploadEl = document.getElementById('fileUpload');
		if(messageEl.value !== "" || uploadEl.files[0] !== undefined){
			if(uploadEl.files[0] === undefined){
				const message = messageEl.value;
				messageEl.value = "";
				this.props.sendChatMessage("text", message);
			}else{
				if (uploadEl.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)){
					this.sendImage(uploadEl.files[0]);
					uploadEl.value = "";
				}
			}
		}
	}
	
	sendImage = (file) => {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			this.props.sendChatMessage("image", "open");
		
			const CHUNK_LENGTH = 60000;
			const len = Math.floor(reader.result.length / CHUNK_LENGTH);
			
			if(len === 0){
				this.props.sendChatMessage("image", reader.result);
			}else{
				for(let i = 0; i < len; i++){
					this.props.sendChatMessage("image", reader.result.substring((CHUNK_LENGTH*i), (CHUNK_LENGTH*(i+1))));
				}
				this.props.sendChatMessage("image", reader.result.substring((CHUNK_LENGTH*len), reader.result.length));
			}
			
			this.props.sendChatMessage("image", "close");
		};
	}

	render(){
  	return (
			<Col className="footer fixed-bottom" sm="12" md="12">
				<Col sm="12" md={{ size: 8, offset: 1 }}>
						<Form inline onSubmit={this.getTextMessage}>
							<FormGroup>
								<Input type="text" name="textmessage" id="messageToSend" placeholder="Type your message" />
								<Input type="file" name="fileUpload" id="fileUpload" />
							</FormGroup>
							<Button className="btn-admin">Send message</Button>
						</Form>
				</Col>
			</Col>
  	);
	}
}
