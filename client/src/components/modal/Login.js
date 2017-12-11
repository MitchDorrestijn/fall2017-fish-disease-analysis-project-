import React from 'react';
import {
	ModalHeader,
	ModalBody,
	Button,
	Form,
	FormGroup,
	Label,
	InputGroup,
	InputGroupAddon,
	Input
} from 'reactstrap';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Error from './Error';
import Translate from 'translate-components';

class Login extends React.Component {	

	sendUserInfo = (e) => {
		e.preventDefault();
		this.props.userLogin(document.getElementById("email").value, document.getElementById("password").value);
	}

	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}><Translate>Login</Translate></ModalHeader>
				<ModalBody>
					{ this.props.isErrorVisible ?
						<Error errorContent={this.props.errorContent} /> :
						null
					}
					<Form onSubmit={(e) => this.sendUserInfo(e)}>
						<FormGroup>
							<Label for="email"><Translate>Email address</Translate></Label>
							<InputGroup>
								<InputGroupAddon><i className="fa fa-user"/></InputGroupAddon>
								<Input type="email" id="email" placeholder="Email address"/>
							</InputGroup>
						</FormGroup>
						<FormGroup>
							<Label for="password"><Translate>Password</Translate></Label>
							<InputGroup>
								<InputGroupAddon><i className="fa fa-lock"/></InputGroupAddon>
								<Input type="password" id="password" placeholder="Password"/>
							</InputGroup>
						</FormGroup>
						<hr/>
						<Button outline className="modalLink" color="secondary" block><Translate>Login</Translate></Button>
					</Form>
					<br/>
					<p className="center">
						<Translate>Not registered?</Translate> <u><a className="modalLink" onClick={() => this.props.openModal(Register)}><Translate>Create an account</Translate></a></u>
						<br/>
						<u><a className="modalLink" onClick={() => this.props.openModal(ForgotPassword)}><Translate>Forgot password?</Translate></a></u>
					</p>
				</ModalBody>
			</div>
		);
	}
}

export default Login;
