import React from 'react';
import {
	ModalHeader,
	ModalBody,
	Button,
	FormGroup,
	Label,
	InputGroup,
	InputGroupAddon,
	Input
} from 'reactstrap';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Error from './Error';

class Login extends React.Component {
	render() {
		return (
			<div>			
				<ModalHeader toggle={() => this.props.toggleModal()}>Login</ModalHeader>
				<ModalBody>
					{ this.props.isErrorVisible ?
						<Error errorContent={this.props.errorContent} /> :
						null
					}
					<FormGroup>
						<Label for="email">Email address</Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-user"/></InputGroupAddon>
							<Input type="email" id="email" placeholder="Email address"/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="password">Password</Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-lock"/></InputGroupAddon>
							<Input type="password" id="password" placeholder="Password"/>
						</InputGroup>
					</FormGroup>
					<FormGroup check>
						<Label check>
							<Input type="checkbox" />
							Remember me
						</Label>
					</FormGroup>
					<hr/>
					<Button outline className="modalLink" color="secondary" onClick={() => this.props.userLogin(document.getElementById("email").value, document.getElementById("password").value)} block>Login</Button>
					<br/>
					<p className="center">
						Not registered? <u><a className="modalLink" onClick={() => this.props.openModal(Register)}>Create an account</a></u>
						<br/>
						<u><a className="modalLink" onClick={() => this.props.openModal(ForgotPassword)}>Forgot password?</a></u>
					</p>
				</ModalBody>
			</div>
		);
	}
}

export default Login;