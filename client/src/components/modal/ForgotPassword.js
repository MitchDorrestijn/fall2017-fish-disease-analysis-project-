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
import Login from './Login';
import Error from './Error';
import Translate from 'translate-components';

class ForgotPassword extends React.Component {
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}><Translate>Forgot Password</Translate></ModalHeader>
				<ModalBody>
					<Alert color="secondary">
						<Translate>Information about recover password</Translate>
					</Alert>
					{ this.props.isErrorVisible ?
						<Error errorContent={this.props.errorContent} /> :
						null
					}
					<FormGroup>
						<Label for="email"><Translate>Email address</Translate></Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-user"/></InputGroupAddon>
							<Input type="email" id="email" placeholder="Email address"/>
						</InputGroup>
					</FormGroup>
					<hr/>
					<Button outline className="modalLink" color="secondary" onClick={() => this.props.userForgotPassword(document.getElementById("email").value)} block><Translate>Continue</Translate></Button>
					
					<p className="center">
						Remembered your password? <u><a className="modalLink" onClick={() => this.props.openModal(Login)}><Translate>Login</Translate></a></u>
					</p>
				</ModalBody>
			</div>
		);
	}
}

export default ForgotPassword;