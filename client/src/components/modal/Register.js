import React from 'react';
import {
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button
} from 'reactstrap';

class Register extends React.Component {
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Register</ModalHeader>
				<ModalBody>
					<Button color="primary" onClick={() => this.props.changeContent(this.props.Login)}>Login</Button><br/>
					<Button color="primary" onClick={() => this.props.changeContent(this.props.ForgetPassword)}>Forget password</Button>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={() => this.props.toggleModal()}>Close</Button>
				</ModalFooter>
			</div>
		);
	}
}

export default Register;