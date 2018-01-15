import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, Input, Form, FormGroup, Label, FormText} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class ChangeTimeSlot extends Component {
  constructor(props){
	super(props);
	this.state = {
	  duration: "",
	  startDate: "",
	  error: ""
	}
  }
  componentWillMount() {
	this.setState({
	  // we get timestamp from database, change so we can use it as a type date input field
	  startDate: this.props.customProps.entry.startDate,
	  duration: this.props.customProps.entry.duration
	});
  }
  editTimeslot = (e) => {
	e.preventDefault();
	let timeslotData = {
	  startDate: this.state.startDate,
	  duration: this.state.duration
	};
	for (let key in timeslotData) {
	  if (!timeslotData[key]) {
		delete timeslotData[key];
	  }
	}
	if(timeslotData.startDate && timeslotData.duration){
	  let da = new DataAccess();
	  da.putData(`/timeslots/${this.props.customProps.entry.id}`, {timeslot: timeslotData},  (err, res) => {
		if (!err) {
		  this.props.toggleModal();
		  this.props.customProps.refreshPage();
		} else {
		  this.setState({error: "An error occurred!"});
		}
	  });
	} else {
	  this.setState({error: "Please fill in all fields."});
	}
  };
  changeStartDate = (e) => {
	this.setState({startDate: e.target.value});
  };
  changeDuration = (e) => {
	this.setState({duration: e.target.value});
  };

  render() {
	return (
	  <div>
		<ModalHeader toggle={() => this.props.toggleModal()}>Edit Timeslot</ModalHeader>
		<ModalBody>
		  <p className="error">{this.state.error}</p>
		  <Form onSubmit={this.editTimeslot}>
			<FormGroup>
			  <Label for="startingDate">Starting Date:</Label>
			  <Input id="startingDate" type="datetime-local" name="startingDate" value={this.state.startDate.slice(0,16)} onChange={this.changeStartDate} />
			</FormGroup>
			<FormGroup>
			  <Label for="timeslotDuration">Duration in minutes:</Label>
			  <Input id="timeslotDuration" type="number" min="0" max="240" name="timeslotDuration" value={this.state.duration} onChange={this.changeDuration} />
			</FormGroup>
			<Button>Edit</Button>
		  </Form>
		</ModalBody>
	  </div>
	);
  }
}
