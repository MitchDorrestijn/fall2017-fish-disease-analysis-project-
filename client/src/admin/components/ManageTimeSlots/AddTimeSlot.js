import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, Input, Form, FormGroup, Label, FormText} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';
import * as Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'

export default class AddTimeSlot extends Component {
  constructor(props){
	super(props);
	// const today = new Date().toISOString().slice(0,16);
	this.state = {
	  duration: "",
	  startDate: Datetime.moment().startOf('minute'),
	  error: ""
	}
  }

  addTimeslot = (e) => {
	e.preventDefault();
	let timeslotData = {
	  startDate: this.state.startDate.format(),
	  duration: this.state.duration
	};
	for (let key in timeslotData) {
	  if (!timeslotData[key]) {
		delete timeslotData[key];
	  }
	}
	if(timeslotData.startDate && timeslotData.duration){
	  let da = new DataAccess();
	  da.postData(`/timeslots/`, {timeslot: timeslotData},  (err, res) => {
		if (!err) {
		  this.props.toggleModal();
		  console.log(this.props.customProps);
		  this.props.customProps.refreshPage();
		} else {
		  this.setState({error: "An error occurred!"});
		}
	  });
	} else {
	  this.setState({error: "Please fill in all fields."});
	}
  };

  changeDuration = (e) => {
	this.setState({duration: e.target.value});
  };

  changeDate = (e) => {
	this.setState({startDate: e});
  };

  render() {
	const yesterday = Datetime.moment().subtract( 1, 'day' );
	const valid = function(current) {
	  return current.isAfter( yesterday );
	};

	return (
	  <div>
		<ModalHeader toggle={() => this.props.toggleModal()}>Add a new timeslot</ModalHeader>
		<ModalBody>
		  <p className="error">{this.state.error}</p>
		  <Form onSubmit={this.addTimeslot}>
			<Datetime onChange={this.changeDate} isValidDate={ valid } />
			<FormGroup>
			  <Label for="timeslotDuration">Duration in minutes:</Label>
			  <Input id="timeslotDuration" type="number" min="0" max="240" name="timeslotDuration" value={this.state.duration} onChange={this.changeDuration}/>
			</FormGroup>
			<Button>Add</Button>
		  </Form>
		</ModalBody>
	  </div>
	);
  }
}
