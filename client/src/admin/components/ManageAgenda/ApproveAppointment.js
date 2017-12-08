import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody} from 'reactstrap';

export default class ApproveAppointment extends Component {
	approveAppointment = () => {
		// Hier moet die putData request gedaan worden
		this.props.customProps.refreshPage();
		this.props.toggleModal();
	};

	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Approve appointment</ModalHeader>
				<ModalBody>
					Are you sure you want to approve this appointment?
					<hr/>
					<Button onClick={this.approveAppointment} outline className="modalLink" color="secondary" block>Yes</Button>
					<Button onClick={this.props.toggleModal} outline className="modalLink" color="secondary" block>No</Button>
				</ModalBody>
			</div>
		);
	}
}
