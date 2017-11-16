import React from 'react';
import {
	ModalHeader,
	ModalBody,
	Button,
	FormGroup,
	Label,
	InputGroup,
	InputGroupAddon,
	Input,
	Alert
} from 'reactstrap';

class ForgotPassword extends React.Component {
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Forgot Password</ModalHeader>
				<ModalBody>
					<Alert color="secondary">
						Information about recover password
					</Alert>
					<FormGroup>
						<Label for="email">Email address</Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-user"/></InputGroupAddon>
							<Input type="email" id="email" placeholder="Email address"/>
						</InputGroup>
					</FormGroup>
					<hr/>
					<Button outline className="modalLink" color="secondary" onClick={() => this.props.changeContent(this.props.ForgotPasswordSend)} block>Continue</Button>
					
					<p className="center">
						Remembered your password? <u><a className="modalLink" onClick={() => this.props.changeContent(this.props.Login)}>Login</a></u>
					</p>
				</ModalBody>
			</div>
		);
	}
}

export default ForgotPassword;