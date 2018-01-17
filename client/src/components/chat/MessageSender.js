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
	constructor(props){
		super(props);
		this.state = {
			showPreview: false,
			preview: <img className="filePreview" src="" id="filePreview" alt="Preview" />
		}
	}

	sendMessage = (e) => {
		//Haal bericht op
		e.preventDefault();
		const messageEl = document.getElementById('messageToSend');
		const message = messageEl.value;
		const uploadEl = document.getElementById('fileUpload');
		if(messageEl.value !== "" || uploadEl.files[0] !== undefined){
			if(uploadEl.files[0] === undefined){
				messageEl.value = "";
				this.props.sendChatMessage("text", {"name": this.props.name, "message": message});
			}else{
				if(uploadEl.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)){
					this.sendFile("image", uploadEl.files[0], message);
				}else if(uploadEl.files[0].name.match(/.(mp4|avi|mov|flv|wmv|m4p)$/i)){
					this.sendFile("video", uploadEl.files[0], message);
				}else{
					this.props.showFeedback("danger", "This file type is not supported. The supported file types are: images(.jpg, .jpeg, .png, .gif) and videos(.mp4, .avi, .mov, .flv, .wmv, .m4p).");
				}
				uploadEl.value = "";
				messageEl.value = "";
				this.handleFileChange();
			}
		}
	}

	handleFileChange = () => {
		const uploadEl = document.getElementById("fileUpload");
		const removeEl = document.getElementById("removeImage");
		if(uploadEl.files[0] === undefined){
			this.setState({
				showPreview: false
			});
			removeEl.style.visibility = "hidden";
		}else{
			this.setState({
				showPreview: true
			}, () => {
				var fr = new FileReader();
				fr.onload = () => {
					let previewEl = null;
					if(uploadEl.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)){
						previewEl = <div className="filePreview"><img src={fr.result} id="filePreview" alt="Preview" />{uploadEl.files[0].name}</div>
					}else if(uploadEl.files[0].name.match(/.(mp4|avi|mov|flv|wmv|m4p)$/i)){
						previewEl = <div className="filePreview"><video src={fr.result} id="filePreview" autoPlay muted></video>{uploadEl.files[0].name}</div>
					}
					this.setState({
						preview: previewEl
					});
				};
				fr.readAsDataURL(uploadEl.files[0]);
			});

			removeEl.style.visibility = "visible";
		}
	}

	deleteImage = () => {
		document.getElementById("fileUpload").value = "";
		this.handleFileChange();
	}

	sendFile = (type, file, message) => {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const CHUNK_LENGTH = 60000;
			const MESSAGE_ID = Math.random().toString(36).substr(2, 9);
			const len = Math.floor(reader.result.length / CHUNK_LENGTH);

			this.props.sendChatMessage(type, {"name": this.props.name, "state": "open", "message": message}, MESSAGE_ID, 0, len+1);

			if(len === 0){
				this.props.sendChatMessage(type, {"name": this.props.name, "state": "sending", "message": reader.result}, MESSAGE_ID, 1, 1);
			}else{
				for(let i = 0; i < len; i++){
					this.props.sendChatMessage(type, {"name": this.props.name, "state": "sending", "message": reader.result.substring((CHUNK_LENGTH*i), (CHUNK_LENGTH*(i+1)))}, MESSAGE_ID, i+1, len+1);
				}
				this.props.sendChatMessage(type, {"name": this.props.name, "state": "sending", "message": reader.result.substring((CHUNK_LENGTH*len), reader.result.length)}, MESSAGE_ID, len+1, len+1);
			}

			this.props.sendChatMessage(type, {"name": this.props.name, "state": "close", "message": message}, MESSAGE_ID, len+1, len+1);
		};
	}

	render(){
		return (
				<Col className="footer fixed-bottom" sm="12" md="12">
					<Col sm="12" md={{ size: 8, offset: 2 }}>
						<Form onSubmit={(e) => this.sendMessage(e)}>
							<InputGroup>
								<span className="removeImage" id="removeImage" title="Clear file" onClick={() => this.deleteImage()}><i className="fa fa-times "/></span>
								<InputGroupAddon id="fileUploadButton" className="fileUpload-wrapper" title="Upload file">
									<label htmlFor="fileUpload">
										<i className="fa fa-paperclip"/>
									</label>
									<input id="fileUpload" type="file" onChange={() => this.handleFileChange()}/>
								</InputGroupAddon>
								{
									this.state.showPreview ?
									(
										<UncontrolledTooltip autohide={false} placement="top" target="fileUploadButton">
											{this.state.preview}
										</UncontrolledTooltip>
									):null
								}

								<Input type="text" className="messageToSend" id="messageToSend" placeholder="Type your message" />
								<InputGroupButton className="sendButton" id="sendButton" color="dark" disabled={!this.props.chatStatus}>Send message</InputGroupButton>
							</InputGroup>
						</Form>
					</Col>
				</Col>
		);
	}
}