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
						toggleModal={this.props.closeModal}
						openModal={this.props.openModal}
					/> : null}
			</Modal>
		);
	}
}
