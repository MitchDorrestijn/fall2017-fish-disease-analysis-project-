import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, FormGroup, InputGroup, Input, Label, Tooltip} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class ChangeNotificationRule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.customProps.entry,
			error: '',
			tooltipOpen: false
		};
		this.attributes = ['Phosphate', 'Nitrate', 'Nitrite', 'Iron', 'gH', 'Temperature', 'Oxygen', 'Carbon', 'Dioxide', 'kH', 'Chlorine'];
		this.toggle = this.toggle.bind(this);
	};

	//changeState functions:
	toggle() {
		this.setState({
			tooltipOpen: !this.state.tooltipOpen
		});
	}
	changeData = (field, evt) => {
		let data = this.state.data;
		data[field] = evt.target.value;
		this.setState({
			data: data
		});
	};
	changeTriggerData = (field, evt) => {
		let data = this.state.data;
		data.triggers[evt.target.id][field] = evt.target.value;
		this.setState({
			data: data
		});
	};
	changeAttribute = (evt) => {
		this.changeTriggerData('attribute', evt);
	};
	changeEquation = (evt) => {
		this.changeTriggerData('equation', evt);
	};
	changeCompared = (evt) => {
		this.changeTriggerData('compared', evt);
	};
	changeMin = (evt) => {
		this.changeTriggerData('min', evt);
	};
	changeMax = (evt) => {
		this.changeTriggerData('max', evt);
	};
	changeMessage = (evt) => {
		this.changeData('message', evt);
	};
	changeType = (evt) => {
		this.changeData('type', evt);
	};

	//increment triggerCount
	increaseTriggerCount = () => {
		let data = this.state.data;
		data.triggers.push({});
		this.setState({
			data: data
		});
	};
	removeTrigger = (index) => {
		let data = this.state.data;
		data.triggers.splice(index, 1);
		this.setState({
			data: data
		});
	};

	//get/post/put data functions:
	changeNotificationRule = () => {
		let dataObject = this.state.data;
		//validation
		let error = [];
		if (!dataObject.message)	{error.push('message')};
		if (!dataObject.type)			{error.push('type')};
		for (let i = 0; i < dataObject.triggers.length; i++) {
			if ((!dataObject.triggers[i].compared && (!dataObject.triggers[i].min && !dataObject.triggers[i].max)) || !dataObject.triggers[i].attribute || !dataObject.triggers[i].equation)	{
				error.push(`trigger ${i +1}`);
			} else {
				//remove accidental filled-in data
				if (dataObject.triggers[i].equation === 'range') {
					dataObject.triggers[i].compared = null;
				} else {
					dataObject.triggers[i].min = dataObject.triggers[i].max = null;
				};
			};
		};
		if (error.length > 0) {
			this.setState({error: `Fill in: ${error.toString()}`});
		} else {
			this.putNotificationRule(dataObject);
		};
	};
	putNotificationRule = (dataObject) => {
		let da = new DataAccess ();
		da.putData(`/notifications/rules/${dataObject.id}`, {rule: dataObject}, (err, res) => {
			if (!err) {
				this.props.customProps.refreshPage();
				this.props.toggleModal();
			} else {
				console.log(err);
			};
		});
	};

	//fill form selections functions:
	showAttributes = () => {
		let options = [];
		this.attributes.forEach( (value, index) => {
			options.push(<option key={index} value={value}>{value}</option>)
		});
		return options
	};

	//make needed imputs between range and others in equation:
	showCompared = (trigger, id) => {
		if (trigger.equation === 'range') {
			return (
				<FormGroup key='0'>
					<Label>Min</Label><br/>
					<InputGroup>
						<Input id={id} type='number' value={trigger.min} onChange={this.changeMin}/>
					</InputGroup>
					<Label>Max</Label><br/>
					<InputGroup>
						<Input id={id} type='number' value={trigger.max} onChange={this.changeMax}/>
					</InputGroup>
				</FormGroup>
			);
		} else {
			return (
				<FormGroup key='1'>
					<Label>Compared</Label><br/>
					<InputGroup>
						<Input id={id} type='number' value={trigger.compared} onChange={this.changeCompared}/>
					</InputGroup>
				</FormGroup>
			);
		};
	};

	showTrigger = (triggers) => {
		let returnData = [];
		for (let i = 0; i < this.state.data.triggers.length; i++) {
			returnData.push(
				<div key={i* this.state.data.length* 1.33}>
					<h5>Notification trigger {i+1}
						{this.drawRemoveTriggerButton(i)}
					</h5>
					<FormGroup>
						<Label>Attribute</Label><br/>
						<InputGroup>
							<Input id={i} type='select' value={triggers[i].attribute} onChange={this.changeAttribute}>
								<option selected disabled hidden>Choose here</option>
								{this.showAttributes()}
							</Input>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label>Equation</Label><br/>
						<InputGroup>
							<Input id={i} type='select' value={triggers[i].equation} onChange={this.changeEquation}>
								<option selected disabled hidden>Choose here</option>
								<option value='>'>bigger than</option>
								<option value='<'>smaller than</option>
								<option value='=='>equal to</option>
								<option value='range'>between</option>
							</Input>
						</InputGroup>
					</FormGroup>
					{this.showCompared(triggers[i], i)}
					<hr/>
				</div>
			);
		};
		return returnData;
	};

	//check if there is only one trigger which can't be removed
	drawRemoveTriggerButton = (index) => {
		if (this.state.data.triggers.length > 1) {
			return (
				<div className="close">
					<a onClick={() => this.removeTrigger(index)}><span className="fa fa-close"/></a>
				</div>
			);
		};
	};

	render() {
		const {triggers, message, type} = this.state.data;
		const {toggleModal} = this.props;
		return (
			<div>
				<ModalHeader toggle={toggleModal}>Change notification rule</ModalHeader>
				<ModalBody>
					{this.showTrigger(triggers)}
					<Button onClick={this.increaseTriggerCount} outline className='modalLink' color='secondary' block>Add additional notification trigger</Button>
					<hr/>
					<FormGroup>
						<Label>Notification message <a href="#" id="TooltipMessage">(more info)</a></Label><br/>
						<Tooltip placement="right" isOpen={this.state.tooltipOpen} target="TooltipMessage" toggle={this.toggle}>
							Placeholders: <br /><br />
							{'{aquarium}: will show the concerned aquarium name'} <br /><br />
							{'{attribute} (like {Iron}): will show the concerned value, of the specified attribute, put in by the user'}
						</Tooltip>
						<InputGroup>
							<Input type='text' value={message} onChange={this.changeMessage}/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label>Notification type</Label><br/>
						<InputGroup>
							<Input type='select' value={type} onChange={this.changeType}>
								<option value='Urgent'>Urgent</option>
								<option value='Warning'>Warning</option>
							</Input>
						</InputGroup>
					</FormGroup>
					<hr/>
					<p className="error">{this.state.error}</p>
					<Button onClick={this.changeNotificationRule} outline className='modalLink' color='secondary' block>Save changes</Button>
					<Button onClick={toggleModal} outline className='modalLink' color='secondary' block>Cancel</Button>
				</ModalBody>
			</div>
		);
	};
};
