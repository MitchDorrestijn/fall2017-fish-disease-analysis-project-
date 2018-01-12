import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, Alert} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class RemoveAppointment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null
		}
	}

	cancelAppointment = () => {
		const {entry, refreshPage} = this.props.customProps;
		const {toggleModal} = this.props;
		let da = new DataAccess();
		da.deleteData ('/appointments/' + entry.id, (err, res) => {
			if (!err) {
				refreshPage();
				toggleModal();
			} else {
				this.setState ({error: <Alert>err.message</Alert>});
			}
		});
	};

	render() {
		const {toggleModal} = this.props;
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Cancel appointment</ModalHeader>
				<ModalBody>
					{this.state.error}
					Are you sure you want to cancel this appointment?
					<hr/>
					<Button onClick={this.cancelAppointment} outline className="modalLink" color="secondary" block>Yes</Button>
					<Button onClick={toggleModal} outline className="modalLink" color="secondary" block>No</Button>
				</ModalBody>
			</div>
		);
	}
}