import React from 'react';
import {
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button
} from 'reactstrap';

class Login extends React.Component {
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Login</ModalHeader>
				<ModalBody>
					<Button color="primary" onClick={() => this.props.changeContent(this.props.Register)}>Register</Button><br/>
					<Button color="primary" onClick={() => this.props.changeContent(this.props.ForgetPassword)}>Forget password</Button>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={() => this.props.toggleModal()}>Close</Button>
				</ModalFooter>
			</div>
		);
	}
}

export default Login;