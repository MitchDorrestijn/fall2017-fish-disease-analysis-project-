import React from 'react';
import {
	Modal
} from 'reactstrap';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ForgotPasswordSend from './ForgotPasswordSend';

export default class ModalBase extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: true,
			modalContent: Login
		}
	}
	
	toggleModal = () => {
		this.setState({
			modal: !this.state.modal
		});
	};
	
	changeContent = (component) => {
		this.setState({
			modalContent: component
		});
	};
	
	render() {
		const ModalContent = this.state.modalContent;
		return (
			<Modal isOpen={this.state.modal} toggle={() => this.toggleModal()}>
				<ModalContent Login={Login} Register={Register} ForgotPasswordSend={ForgotPasswordSend} ForgotPassword={ForgotPassword} changeContent={this.changeContent} toggleModal={this.toggleModal}/>
			</Modal>
		);
	}
}
