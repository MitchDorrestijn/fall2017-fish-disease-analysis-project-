import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody} from 'reactstrap';

export default class RemoveAppointment extends Component {
	cancelAppointment = () => {
		// Hier moet die deleteData request gedaan worden
		this.props.customProps.refreshPage();
		this.props.toggleModal();
	};

	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Cancel appointment</ModalHeader>
				<ModalBody>
					Are you sure you want to cancel this appointment
					<hr/>
					<Button onClick={this.cancelAppointment} outline className="modalLink" color="secondary" block>Yes</Button>
					<Button onClick={this.props.toggleModal} outline className="modalLink" color="secondary" block>No</Button>
				</ModalBody>
			</div>
		);
	}
}