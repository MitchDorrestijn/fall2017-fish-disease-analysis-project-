import React from 'react';
import {
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button
} from 'reactstrap';

class ForgetPassword extends React.Component {
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Forget Password</ModalHeader>
				<ModalBody>
					<Button color="primary" onClick={() => this.props.changeContent(this.props.Register)}>Register</Button><br/>
					<Button color="primary" onClick={() => this.props.changeContent(this.props.Login)}>Login</Button>
				</ModalBody>
				<ModalFooter>
					<Button color="primary" onClick={() => this.props.toggleModal()}>Close</Button>
				</ModalFooter>
			</div>
		);
	}
}

export default ForgetPassword;