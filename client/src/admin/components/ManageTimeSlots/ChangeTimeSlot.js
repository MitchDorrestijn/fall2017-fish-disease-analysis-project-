import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, Input, Form, FormGroup, Label} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';
import * as Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

export default class ChangeTimeSlot extends Component {
	constructor(props) {
		super(props);
		this.state = {
			duration: '',
			startDate: '',
			error: '',
		};
	}

	componentWillMount() {
		this.setState({
			// we get timestamp from database, change so we can use it as a type date input field
			startDate: this.props.customProps.entry.startDate,
			duration: this.props.customProps.entry.duration,
		});
	}

	editTimeslot = (e) => {
		e.preventDefault();
		let timeslotData = {
			startDate: this.state.startDate.format(),
			duration: this.state.duration,
		};
		for (let key in timeslotData) {
			if (!timeslotData[key]) {
				delete timeslotData[key];
			}
		}
		if (timeslotData.startDate && timeslotData.duration) {
			console.log(new Date(timeslotData.startDate));
			let da = new DataAccess();
			da.putData(`/timeslots/${this.props.customProps.entry.id}`, {timeslot: timeslotData}, (err, res) => {
				if (!err) {
					this.props.toggleModal();
					this.props.customProps.refreshPage();
				} else {
					this.setState({error: 'An error occurred!'});
				}
			});
		} else {
			this.setState({error: 'Please fill in all fields.'});
		}
	};

	changeDuration = (e) => {
		this.setState({duration: e.target.value});
	};

	changeDate = (e) => {
		this.setState({startDate: e});
	};

	render() {
		const yesterday = Datetime.moment().subtract(1, 'day');
		const valid = function(current) {
			return current.isAfter(yesterday);
		};
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Edit Timeslot</ModalHeader>
				<ModalBody>
					<p className="error">{this.state.error}</p>
					<Form onSubmit={this.editTimeslot}>
						<Label>Date:</Label>
						<Datetime onChange={this.changeDate} defaultValue={Datetime.moment(this.state.startDate).format('MM/DD/YYYY h:mm A')} isValidDate={valid}/>
						<FormGroup>
							<Label for="timeslotDuration">Duration in minutes:</Label>
							<Input id="timeslotDuration" type="number" min="0" max="240" name="timeslotDuration"
							       value={this.state.duration} onChange={this.changeDuration}/>
						</FormGroup>
						<Button>Edit</Button>
					</Form>
				</ModalBody>
			</div>
		);
	}
}
