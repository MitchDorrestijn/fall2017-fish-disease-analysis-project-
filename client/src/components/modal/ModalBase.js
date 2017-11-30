import React from 'react';
import {
	Modal
} from 'reactstrap';

export default class ModalBase extends React.Component {
	render() {
		const ModalContent = this.props.children;
		return (
			<Modal isOpen={this.props.isVisible} toggle={this.props.closeModal}>
				{ModalContent ?
					<ModalContent
						isErrorVisible={this.props.isErrorVisible}
						errorContent={this.props.errorContent}
						showError={this.props.showError}
						userLogin={this.props.userLogin}
						userRegister={this.props.userRegister}
						userForgotPassword={this.props.userForgotPassword}
						userResetPassword={this.props.userResetPassword}
						toggleModal={this.props.closeModal}
						openModal={this.props.openModal}
						customProps={this.props.customProps}
					/> : null}
			</Modal>
		);
	}
}
