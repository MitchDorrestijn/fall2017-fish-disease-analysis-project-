import React from 'react';
import {Col, Input, Card, CardHeader, CardBody, CardFooter, Badge, CardTitle, CardText, FormGroup, Label, UncontrolledTooltip, CardSubtitle} from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import * as firebase from 'firebase';
import ShowChatLog from '../../modal/ShowChatLog';
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
			timeslotId: document.getElementById('dateTime').value,
			comment: document.getElementById('comment').value
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
				this.initSetters();
			} else {
				console.log(err);
			};
		});
	};
	
	showLog = (appointmentId) => {		
		let da = new DataAccess ();
		da.getData ('/appointments/' + appointmentId, (err, res) => {
			if(!err){
				this.appointment = res.message;
				da.getData ('/timeslots/' + this.appointment.timeslotId, (err, res) => {
					if (!err) {
						this.appointment.timeslot = res.message;
						let parsedDate = this.parseAppointmentDate(this.appointment.timeslot);
						
						this.props.openModal(ShowChatLog, {chatLog: this.appointment.chatLog, timeSlot: parsedDate});
					}else{
						console.log(err.message);
					}
				});
			}else{
				console.log(err.message);
			}
		});
	}
	
	parseAppointmentDate = (timeslot) => {
		return this.parseDate(timeslot.startDate) + " from " + this.parseTime(timeslot.startDate) + " till " + this.parseTime(timeslot.endDate);
	}
	
	parseDate = (date) => {
		let parsedDate = new Date (date);
		return parsedDate.toDateString();
	}

	parseTime = (date) => {
		let parsedDate = new Date (date);
		let hours = parsedDate.getHours();
		let minutes = parsedDate.getMinutes();
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		return `${hours}:${minutes}`;
	}
	
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
				cards.push(<Col key='header'><h1 className='center'>Current requested consults</h1></Col>)
			};
			if (this.state.appointments.hasOwnProperty(key)) {
				let cardHeaderContent;
				let cardFooterContent;
				if(this.state.appointments[key].status){
					cardHeaderContent = (<Badge color="success">Open</Badge>);
					cardFooterContent = (<ActionButton buttonText='Go to chat room' linkTo={"/chat/" + this.state.appointments[key].id} color='primary btn-transperant'/>)
				}else{
					cardHeaderContent = (<Badge color="danger">Closed</Badge>);
					cardFooterContent = (<ActionButton buttonText='Download chatlog' onClickAction={() => this.showLog(this.state.appointments[key].id)} color='primary btn-transperant'/>)
				}
				
				cards.push(
					<Col key={key}>
						<Card>
							<CardHeader>
								<h5>
									{cardHeaderContent}
								</h5>
							</CardHeader>
							<CardBody>
								<CardTitle>
									Consult on: {this.state.appointments[key].timeslot.startDate.substring(0, 10)} from {this.state.appointments[key].timeslot.startDate.substring(11, 16)} till {this.state.appointments[key].timeslot.endDate.substring(11, 16)} UTC+1
								</CardTitle>
								<CardSubtitle>Description:</CardSubtitle>
								<CardText>{this.state.appointments[key].comment}</CardText>
							</CardBody>
							<CardFooter>
								{cardFooterContent}
							</CardFooter>
						</Card>
					</Col>
				);
			};
		};
		return cards;
	};

	render() {
		return (
			<div className='account-settings'>
				<div className='container'>
					<div className='row inner-content'>
						<div className='col-md-12 no-gutter'>
							{this.drawConsultsCards()}
							<Col>
								<h1 className='center'>Request new consult</h1>
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
											<UncontrolledTooltip placement="top" target="descriptionTip">
												Try to give as many information as possible in your description. The consultant will prepare for your consult by your given information here
											</UncontrolledTooltip>
											<Label for='exampleText'>Description <i className="fa fa-question-circle" id="descriptionTip"/></Label>
											<Input type='textarea' name='text' id='comment' value={this.state.comment} onChange={this.onChange.bind(this)}/>
										</FormGroup>
										<div className='text-right'>
											<ActionButton buttonText='Register consult' onClickAction={this.registerRequest} color='primary btn-transperant' disabled/>
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
