import React from 'react';
import { Col } from 'reactstrap';
import { Button, Form, FormGroup, Input } from 'reactstrap';

export default class MessageSender extends React.Component {
	getTextMessage = (e) => {
		e.preventDefault();
		const message = document.getElementById('messageToSend').value;
		console.log(message);
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
