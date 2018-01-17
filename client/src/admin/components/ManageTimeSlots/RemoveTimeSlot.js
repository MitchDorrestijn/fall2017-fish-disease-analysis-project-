import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody,Alert} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class RemoveTimeslot extends Component {
  constructor(props) {
	super(props);
	this.state = {
	  data: props.customProps.entry
	};
  };

  //delete timeslot:
  deleteTimeslot = () => {
	let da = new DataAccess();
	  da.deleteData(`/timeslots/${this.state.data.id}`, (err, res) => {
		if (!err) {
		  if (this.state.data.appointmentId) {
			da.deleteData(`/appointments/${this.state.data.appointmentId}`,
			  (err, res) => {
				if (!err) {
				  this.props.customProps.refreshPage();
				  this.props.toggleModal();
				} else {
				  console.log(err);
				}
			  });
		  } else {
			this.props.customProps.refreshPage();
			this.props.toggleModal();
		  }
		} else {
		  console.log(err);
		}
	  });
  };

  render() {
	let appointmentWarning = '';
    if (this.state.data.appointmentId) {
      appointmentWarning = <Alert color="warning">An appointment is planned on this timeslot, if this timeslot is deleted the linked appointment will also be deleted.</Alert>
	}
	return (
	  <div>
		<ModalHeader toggle={() => this.props.toggleModal()}>Remove
		  timeslot</ModalHeader>
		<ModalBody>
		  {appointmentWarning}
		  Are you sure you want to remove this timeslot?
		  <hr/>
		  <Button onClick={this.deleteTimeslot} outline className='modalLink'
				  color='secondary' block>Yes</Button>
		  <Button onClick={this.props.toggleModal} outline className='modalLink'
				  color='secondary' block>No</Button>
		</ModalBody>
	  </div>
	);
  };
};
