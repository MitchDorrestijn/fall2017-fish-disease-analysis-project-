import React from 'react';
import {
	ModalHeader,
	ModalBody,
	Alert
} from 'reactstrap';

class ForgotPasswordSend extends React.Component {
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Forgot Password</ModalHeader>
				<ModalBody>
					<Alert color="secondary">
						An email has been sent to <i>*Emailaddress*</i>.
					</Alert>
				</ModalBody>
			</div>
		);
	}
}

export default ForgotPasswordSend;