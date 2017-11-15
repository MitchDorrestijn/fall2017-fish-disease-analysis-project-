import React from 'react';
import '../styles/styles.css';

class Header extends React.Component {
	render() {
		return (
			<Modal isOpen={this.state.modal} toggle={() => this.toggleModal()}>
				<ModalHeader toggle={() => this.toggleModal()}>Login</ModalHeader>
					<ModalBody>
						Login body
					</ModalBody>
					<ModalFooter>
					<Button color="primary" onClick={() => this.toggleModal()}>Sluiten</Button>
				</ModalFooter>
			</Modal>
		);
	}
}

export default Header;