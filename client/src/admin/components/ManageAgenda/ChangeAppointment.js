import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, FormGroup, InputGroup, Input, Label} from 'reactstrap';

export default class RemoveAppointment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.customProps.entry
		};
	}

	changeAppointment = () => {
		// Hier moet die putData request gedaan worden
		console.log ("Remove "+this.props.customProps.id);
		this.props.customProps.refreshPage();
		this.props.toggleModal();
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
		const {timeslot, description, video} = this.state.data;
		const {toggleModal} = this.props;
		return (
			<div>
				<ModalHeader toggle={toggleModal}>Change appointment</ModalHeader>
				<ModalBody>
					<FormGroup>
						<Label>Timeslot</Label><br/>
						<InputGroup>
							<Input type="text" value={timeslot} onChange={this.changeTimeslot}/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label>Description</Label><br/>
						<InputGroup>
							<Input type="text" value={description} onChange={this.changeDescription}/>
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