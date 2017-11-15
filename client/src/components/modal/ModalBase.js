import React from 'react';
import {
	Modal
} from 'reactstrap';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

class ModalBase extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: true,
			modalContent: Login
		}
	}
	
	toggleModal(){
		this.setState({
			modal: !this.state.modal
		});
	}
	
	changeContent(component){
		this.setState({
			modalContent: component
		});
	}
	
	render() {
		const ModalContent = this.state.modalContent;
		return (
			<Modal isOpen={this.state.modal} toggle={() => this.toggleModal()}>
				<ModalContent Login={Login} Register={Register} ForgotPassword={ForgotPassword} changeContent={this.changeContent.bind(this)} toggleModal={this.toggleModal.bind(this)}/>
			</Modal>
		);
	}
}

export default ModalBase;