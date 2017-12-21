import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, FormGroup, InputGroup, Input, Label, Tooltip} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class AddNotificationRule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.customProps,
			error: '',
			tooltipOpen: false,
			triggerCount: 1
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
	changeAttribute = (evt) => {
		this.changeData('attribute', evt);
	};
	changeEquation = (evt) => {
		this.changeData('equation', evt);
	};
	changeCompared = (evt) => {
		this.changeData('compared', evt);
	};
	changeMin = (evt) => {
		this.changeData('min', evt);
	};
	changeMax = (evt) => {
		this.changeData('max', evt);
	};
	changeMessage = (evt) => {
		this.changeData('message', evt);
	};
	changeType = (evt) => {
		this.changeData('type', evt);
	};

	//increment triggerCount
	increaseTriggerCount = () => {
		this.setState({
			triggerCount: this.state.triggerCount +1
		});
	};

	//get/post/put data functions:
	addNotificationRule = () => {
		//validation
		if ((!this.state.data.compared && (!this.state.data.min || !this.state.data.max)) ||
				 !this.state.data.attribute || !this.state.data.equation || !this.state.data.message || !this.state.data.type){
			this.setState({error: "Fill in all fields!"});
		} else if ((this.state.data.compared || (this.state.data.min && this.state.data.max)) &&
								this.state.data.attribute && this.state.data.equation && this.state.data.message  && this.state.data.type) {
			//remove unnecessary data before inserting it
			if (this.state.data.equation === 'range') {
				let {data} = this.state;
				data.compared = null;
				this.setState({data: data});
			} else {
				let {data} = this.state;
				data.min = data.max = null;
				this.setState({data: data});
			};
			this.postNotificationRule(this.state.data);
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
	showCompared = (min, max, compared) => {
		if (this.state.data.equation === 'range') {
			return (
				<FormGroup key='0'>
					<Label>Min</Label><br/>
					<InputGroup>
						<Input type='number' value={min} onChange={this.changeMin}/>
					</InputGroup>
					<Label>Max</Label><br/>
					<InputGroup>
						<Input type='number' value={max} onChange={this.changeMax}/>
					</InputGroup>
				</FormGroup>
			);
		} else {
			return (
				<FormGroup key='0'>
					<Label>Compared</Label><br/>
					<InputGroup>
						<Input type='number' value={compared} onChange={this.changeCompared}/>
					</InputGroup>
				</FormGroup>
			);
		};
	};

	//Add multiple options based on trigger triggerCount
	showTrigger = (min, max, compared) => {
		let returnData = [];
		for (let i = 0; i < this.state.triggerCount; i++) {
			returnData.push(
				<div key={i}>
					<h5>Notification trigger {i+1}</h5>
					<FormGroup>
						<Label>Attribute</Label><br/>
						<InputGroup>
							<Input type='select' onChange={this.changeAttribute}>
								<option selected disabled hidden>Choose here</option>
								{this.showAttributes()}
							</Input>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label>Equation</Label><br/>
						<InputGroup>
							<Input type='select' onChange={this.changeEquation}>
								<option selected disabled hidden>Choose here</option>
								<option value='>'>bigger than</option>
								<option value='<'>smaller than</option>
								<option value='=='>equal to</option>
								<option value='range'>between</option>
							</Input>
						</InputGroup>
					</FormGroup>
					{this.showCompared(min, max, compared)}
					<hr/>
				</div>
			);
		};
		return returnData;
	};

	render() {
		console.log(this.state.data);
		const {attribute, equation, compared, min, max, message, type} = this.state.data;
		const {toggleModal} = this.props;
		return (
			<div>
				<ModalHeader toggle={toggleModal}>Change notification rule</ModalHeader>
				<ModalBody>
					<p className="error">{this.state.error}</p>
					{this.showTrigger(min, max, compared)}
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
							<Input type='select' value={type} onChange={this.changeType}>
								<option selected disabled hidden>Choose here</option>
								<option value='Error'>Error</option>
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
