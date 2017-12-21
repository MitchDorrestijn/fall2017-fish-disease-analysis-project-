import React from 'react';
import {Col, Input, Card, CardBody, CardTitle, CardText, FormGroup, Label, CardSubtitle} from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import * as firebase from 'firebase';
import DataAccess from '../../../scripts/DataAccess';

export default class AccountSettings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appointments: {},
			availableDates: {},
			comment: ''
		};
		this.currentUserId = firebase.auth().currentUser.uid;
	};
	//setState functions:
	setAppointments = (data) => {
		this.setState({
			appointments: data
		});
	};
	setAvailableDates = (data) => {
		this.setState({
			availableDates: data
		});
	};
	setComment = (data) => {
		this.setState({
			comment: data
		});
	};
	onChange = (event) => {
		this.setState({
			comment: event.target.value
		});
	};
	//component mount/unmount functions:
	componentWillMount() {
		this.initSetters();
	};
	//get/post data functions:
	initSetters = () => {
		let da = new DataAccess ();
		da.getData ('/opentimeslots/', (err, res) => {
			if (!err) {
				this.setAvailableDates(res.message);
				this.setComment('');
			} else {
				console.log(err);
			};
		});
		da.getData (`/appointments/`, (err, res) => {
			if (!err) {
				this.setAppointments(res.message);
			} else {
				console.log(err);
			};
		});
	};
	registerRequest = () => {
		const appointment = {
			timeSlotId: document.getElementById('dateTime').value,
			comment: document.getElementById('comment').value,
			video: document.getElementById('chatOption').value,
		};
		// Validation possibility
		Object.keys(appointment).forEach( (key) => {
			if (appointment[key] === '') {
				delete appointment[key];
			};
		});
		this.postRequest(appointment);
	};
	postRequest = (dataObject) => {
		let da = new DataAccess ();
		da.postData('/appointments/', {appointment: dataObject}, (err, res) => {
			if (!err) {
				console.log('registered');
				this.initSetters();
			} else {
				console.log(err);
			};
		});
	};
	//option filler for the selector
	fillDateSelector = () => {
		let options = [];
		for (let key in this.state.availableDates) {
			if (this.state.availableDates.hasOwnProperty(key)) {
				options.push(<option key={key} value={this.state.availableDates[key].id}>
					{this.state.availableDates[key].startDate.substring(0, 10)} from {this.state.availableDates[key].startDate.substring(11, 16)} till {this.state.availableDates[key].endDate.substring(11, 16)} UTC+1
				</option>);
			};
		};
		if (options.length === 0) {
			options.push(<option key='' value='' disabled selected hidden>No available timeslots.</option>);
		}
		return options;
	};
	drawConsultsCards = () => {
		let cards = [];
		for (let key in this.state.appointments) {
			if (cards.length === 0) {
				cards.push(<Col key='header'><h1 className='center'>Current registered consults.</h1></Col>)
			};
			if (this.state.appointments.hasOwnProperty(key)) {
				//this.getTimeslot();
				cards.push(
					<Col key={key}>
						<Card>
							<CardBody>
								<CardTitle>
									Consult on: {this.state.appointments[key].timeslot.startDate.substring(0, 10)} from {this.state.appointments[key].timeslot.startDate.substring(11, 16)} till {this.state.appointments[key].timeslot.endDate.substring(11, 16)} UTC+1
								</CardTitle>
								<CardSubtitle>Comment:</CardSubtitle>
								<CardText>{this.state.appointments[key].comment}</CardText>
							</CardBody>
						</Card>
					</Col>
				);
			};
		};
		return cards;
	};

	render() {
		let disabled = true;
		return (
			<div className='account-settings'>
				<div className='container'>
					<div className='row inner-content'>
						<div className='col-md-12 no-gutter'>
							{this.drawConsultsCards()}
							<Col>
								<h1 className='center'>Register new consult.</h1>
							</Col>
							<Col>
								<Card>
									<CardBody>
										<FormGroup>
											<Label for='exampleSelect'>Select date/time (yyyy-mm-dd)</Label>
											<Input type='select' name='select' id='dateTime'>
												{this.fillDateSelector()}
											</Input>
										</FormGroup>
										<FormGroup>
											<Label for='exampleText'>Comment:</Label>
											<Input type='textarea' name='text' id='comment' value={this.state.comment} onChange={this.onChange.bind(this)}/>
										</FormGroup>
										<FormGroup>
											<Label for='exampleSelect'>Chat option:</Label>
											<Input type='select' name='select' id='chatOption'>
												<option value='' disabled selected hidden>Select</option>
												<option value='true'>With sound and video</option>
												<option value='false'>Text only</option>
											</Input>
										</FormGroup>
										<div className='text-right'>
											{this.state.comment ? disabled=false : disabled=true}
											<button disabled={disabled} onClick={this.registerRequest} className='btn btn-outline-primary btn-transparent'>Register consult</button>
										</div>
									</CardBody>
								</Card>
							</Col>
						</div>
					</div>
				</div>
			</div>
		);
	};
};
