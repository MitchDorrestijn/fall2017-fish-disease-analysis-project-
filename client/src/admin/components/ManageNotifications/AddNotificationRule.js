import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, FormGroup, InputGroup, Input, Label, Tooltip} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class AddNotificationRule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.customProps,
			triggers: [{}],
			error: '',
			tooltipOpen: false
		};
		this.attributes = ['Phosphate', 'Nitrate', 'Nitrite', 'Iron', 'gH', 'Temperature', 'Oxygen', 'Carbon', 'Dioxide', 'kH', 'Chlorine'];
		this.toggle = this.toggle.bind(this);
	};

	//change/set State functions:
	toggle() {
		this.setState({
			tooltipOpen: !this.state.tooltipOpen
		});
	};
	changeData = (field, evt) => {
		let data = this.state.data;
		data[field] = evt.target.value;
		this.setState({
			data: data
		});
	};
	changeTriggers = (field, evt) => {
		let triggers = this.state.triggers;
		triggers[evt.target.id][field] = evt.target.value;
		this.setState({
			triggers: triggers
		});
	};
	changeAttribute = (evt) => {
		this.changeTriggers('attribute', evt);
	};
	changeEquation = (evt) => {
		this.changeTriggers('equation', evt);
	};
	changeCompared = (evt) => {
		this.changeTriggers('compared', evt);
	};
	changeMin = (evt) => {
		this.changeTriggers('min', evt);
	};
	changeMax = (evt) => {
		this.changeTriggers('max', evt);
	};
	changeMessage = (evt) => {
		this.changeData('message', evt);
	};
	changeType = (evt) => {
		this.changeData('type', evt);
	};

	//increment triggerCount
	increaseTriggerCount = () => {
		let triggers = this.state.triggers;
		triggers.push({});
		this.setState({
			triggers: triggers
		});
	};
	removeTrigger = (index) => {
		let triggers = this.state.triggers;
		triggers.splice(index, 1);
		this.setState({
			triggers: triggers
		});
	};

	//get/post/put data functions:
	addNotificationRule = () => {
		let dataObject = this.state.data;
		dataObject.triggers = this.state.triggers;
		//validation
		let error = [];
		if (!dataObject.message)	{error.push('message')};
		if (!dataObject.type)			{error.push('type')};
		for (let i = 0; i < this.state.triggers.length; i++) {
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
			this.postNotificationRule(dataObject);
		};
	};
	postNotificationRule = (dataObject) => {
		let da = new DataAccess ();
		da.postData('/notifications/rules', {rule: dataObject}, (err, res) => {
			if (!err.status) {
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
	showCompared = (id) => {
		if (this.state.triggers[id].equation === 'range') {
			return (
				<FormGroup key='0'>
					<Label>Min</Label><br/>
					<InputGroup>
						<Input id={id} type='number' value={this.state.triggers[id].min} onChange={this.changeMin}/>
					</InputGroup>
					<Label>Max</Label><br/>
					<InputGroup>
						<Input id={id} type='number' value={this.state.triggers[id].max} onChange={this.changeMax}/>
					</InputGroup>
				</FormGroup>
			);
		} else {
			return (
				<FormGroup key='1'>
					<Label>Compared</Label><br/>
					<InputGroup>
						<Input id={id} type='number' value={this.state.triggers[id].compared} onChange={this.changeCompared}/>
					</InputGroup>
				</FormGroup>
			);
		};
	};

	//Add multiple options based on trigger triggerCount
	showTrigger = () => {
		let returnData = [];
		for (let i = 0; i < this.state.triggers.length; i++) {
			returnData.push(
				<div key={i* this.state.triggers.length* 1.33}>
					<h5>Notification trigger {i+1}
						{this.drawRemoveTriggerButton(i)}
					</h5>
					<FormGroup>
						<Label>Attribute</Label><br/>
						<InputGroup>
							<Input id={i} type='select' value={this.state.triggers[i].attribute} onChange={this.changeAttribute}>
								<option selected disabled hidden>Choose here</option>
								{this.showAttributes()}
							</Input>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label>Equation</Label><br/>
						<InputGroup>
							<Input id={i} type='select' value={this.state.triggers[i].equation} onChange={this.changeEquation}>
								<option selected disabled hidden>Choose here</option>
								<option value='>'>bigger than</option>
								<option value='<'>smaller than</option>
								<option value='=='>equal to</option>
								<option value='range'>between</option>
							</Input>
						</InputGroup>
					</FormGroup>
					{this.showCompared(i)}
					<hr/>
				</div>
			);
		};
		return returnData;
	};

	//check if there is only one trigger which can't be removed
	drawRemoveTriggerButton = (index) => {
		if (this.state.triggers.length > 1) {
			return (
				<div className="close">
					<a onClick={() => this.removeTrigger(index)}><span className="fa fa-close"/></a>
				</div>
			);
		};
	};

	render() {
		const {toggleModal} = this.props;
		return (
			<div>
				<ModalHeader toggle={toggleModal}>Change notification rule</ModalHeader>
				<ModalBody>
					<p className="error">{this.state.error}</p>
					{this.showTrigger()}
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
							<Input type='text' onChange={this.changeMessage}/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label>Notification type</Label><br/>
						<InputGroup>
							<Input type='select' onChange={this.changeType}>
								<option selected disabled hidden>Choose here</option>
								<option value='Urgent'>Urgent</option>
								<option value='Warning'>Warning</option>
							</Input>
						</InputGroup>
					</FormGroup>
					<hr/>
					<Button onClick={this.addNotificationRule} outline className='modalLink' color='secondary' block>Add notification rule</Button>
					<Button onClick={toggleModal} outline className='modalLink' color='secondary' block>Cancel</Button>
				</ModalBody>
			</div>
		);
	}
}
