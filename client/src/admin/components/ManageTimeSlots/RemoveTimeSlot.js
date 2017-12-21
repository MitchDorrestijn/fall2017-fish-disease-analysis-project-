import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody} from 'reactstrap';
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
	let da = new DataAccess ();
	da.deleteData(`/timeslots/${this.state.data.id}`, (err, res) => {
	  if (!err) {
		this.props.customProps.refreshPage();
		this.props.toggleModal();
	  } else {
		console.log(err);
	  };
	});
  };

  render() {
	return (
	  <div>
		<ModalHeader toggle={() => this.props.toggleModal()}>Remove timeslot</ModalHeader>
		<ModalBody>
		  Are you sure you want to remove this timeslot?
		  <hr/>
		  <Button onClick={this.deleteTimeslot} outline className='modalLink' color='secondary' block>Yes</Button>
		  <Button onClick={this.props.toggleModal} outline className='modalLink' color='secondary' block>No</Button>
		</ModalBody>
	  </div>
	);
  };
};
