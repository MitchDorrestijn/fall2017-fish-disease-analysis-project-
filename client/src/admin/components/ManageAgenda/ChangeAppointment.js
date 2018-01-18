import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, FormGroup, InputGroup, Input, Label} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class RemoveAppointment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.customProps.entry,
			timeslots: [],
			selectedTimeslot: null
		};
		this.da = new DataAccess();
	}

	parseDate = (date) => {
		let parsedDate = new Date (date);
		return parsedDate.toDateString();
	};

	parseTime = (date) => {
		let parsedDate = new Date (date);
		let hours = parsedDate.getHours();
		let minutes = parsedDate.getMinutes();
		if (minutes < 10) {
			minutes = minutes + "0";
		}
		return `${hours}:${minutes}`;
	};

	componentWillMount() {
		this.getTimeslots();
	}

	getTimeslots = () => {
		this.da.getData('/timeslots', (err, res) => {
			if (!err) {
				let results = [];
				let resultsFromDB = res.message;
				results = resultsFromDB.map ((elem) => {
					let isSelected = false;
					const {data} = this.state;
					if (elem.id === data.timeslotId) {
						isSelected = true;
					}
					return (
						<option selected={isSelected} key={elem.id} value={elem.id}>
							{this.parseDate(elem.startDate)} from {this.parseTime(elem.startDate)} to {this.parseTime(elem.endDate)}
						</option>
					);
				});
				this.setState({
					timeslots: results
				});
			}
		});
	};

	changeAppointment = () => {
		// Hier moet die putData request gedaan worden
		console.log ("Remove "+this.props.customProps.id);
		let {data} = this.state;
		let response = {
			comment: data.comment,
			video: data.video,
			approved: data.approved,
			reservedBy: data.reservedBy,
			timeslotId: this.state.selectedTimeslot
		};
		this.da.putData('/appointments/' + data.id, {appointment: response}, (err) => {
			if (!err) {
				this.props.customProps.refreshPage();
				this.props.toggleModal();
			} else {
				console.log(err);
			}
		});
	};

	changeData = (field, evt) => {
		let data = this.state.data;
		data[field] = evt.target.value;
		this.setState({
			data: data
		});
	};

	changeTimeslot = (evt) => {
		this.changeData("timeslot", evt);
	};

	changeDescription = (evt) => {
		this.changeData("description", evt);
	};

	changeVideo = (evt) => {
		let data = this.state.data;
		data.video = evt.target.checked;
		this.setState({
			data: data
		});
	};

	render() {
		const {comment, video} = this.state.data;
		const {toggleModal} = this.props;
		return (
			<div>
				<ModalHeader toggle={toggleModal}>Change appointment</ModalHeader>
				<ModalBody>
					<FormGroup>
						<Label>Timeslot</Label><br/>
						<InputGroup>
							<select className="custom-select" value={this.state.selectedTimeslot}>
								{this.state.timeslots}
							</select>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label>Description</Label><br/>
						<InputGroup>
							<Input type="text" value={comment} onChange={this.changeDescription}/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label>Video</Label>
						<InputGroup>
							<input type="checkbox" checked={video} onChange={this.changeVideo}/>
						</InputGroup>
					</FormGroup>
					<hr/>
					<Button onClick={this.changeAppointment} outline className="modalLink" color="secondary" block>Save changes</Button>
					<Button onClick={toggleModal} outline className="modalLink" color="secondary" block>Cancel</Button>
				</ModalBody>
			</div>
		);
	}
}