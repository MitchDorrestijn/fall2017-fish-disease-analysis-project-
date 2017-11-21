import React from 'react';
import {
	ModalHeader,
	ModalBody,
	Alert
} from 'reactstrap';
import Translate from 'translate-components';

class ForgotPasswordSend extends React.Component {
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}><Translate>Forgot Password</Translate></ModalHeader>
				<ModalBody>
					<Alert color="secondary">
						<Translate>An email has been sent to the given email address. Please follow the instructions given in the mail.</Translate>
					</Alert>
				</ModalBody>
			</div>
		);
	}
}

export default ForgotPasswordSend;