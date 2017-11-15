import React from 'react';
import {
	Modal
} from 'reactstrap';
import Login from './Login';
import Register from './Register';
import ForgetPassword from './ForgetPassword';

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
				<ModalContent Login={Login} Register={Register} ForgetPassword={ForgetPassword} changeContent={this.changeContent.bind(this)} toggleModal={this.toggleModal}/>
			</Modal>
		);
	}
}

export default ModalBase;