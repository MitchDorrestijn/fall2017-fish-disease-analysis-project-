import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class ApproveAppointment extends Component {
	approveAppointment = () => {
		const {toggleModal} = this.props;
		const {refreshPage} = this.props.customProps;
		let {entry} = this.props.customProps;
		let response = {
			canceled: entry.canceled,
			comment: entry.comment,
			timeslotId: entry.timeslotId,
			video: entry.video,
			approved: true
		};
		console.log (entry);

		let da = new DataAccess();
		da.putData('/appointments/' + entry.id, {appointment: response}, (err, res) => {
			if (!err) {
				console.log(res);
				refreshPage();
				toggleModal();
			} else {
				console.log(err);
			}
		});
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
