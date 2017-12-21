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

	//get/post/put data functions:
	changeNotificationRule = () => {
		//validation
		if ((!this.state.data.compared && (!this.state.data.min || !this.state.data.max)) ||
				 !this.state.data.attribute || !this.state.data.equation || !this.state.data.message || !this.state.data.type){
			this.setState({error: 'Fill in all fields!'});
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
			this.putNotificationRule(this.state.data);
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
				<FormGroup key='1'>
					<Label>Compared</Label><br/>
					<InputGroup>
						<Input type='number' value={compared} onChange={this.changeCompared}/>
					</InputGroup>
				</FormGroup>
			);
		};
	};

	render() {
		const {attribute, equation, compared, min, max, message, type} = this.state.data;
		const {toggleModal} = this.props;
		return (
			<div>
				<ModalHeader toggle={toggleModal}>Change notification rule</ModalHeader>
				<ModalBody>
					<p className="error">{this.state.error}</p>
					<FormGroup>
						<Label>Attribute</Label><br/>
						<InputGroup>
							<Input type='select' value={attribute} onChange={this.changeAttribute}>
								{this.showAttributes()}
							</Input>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label>Equation</Label><br/>
						<InputGroup>
							<Input type='select' value={equation} onChange={this.changeEquation}>
								<option value='>'>bigger than</option>
								<option value='<'>smaller than</option>
								<option value='=='>equal to</option>
								<option value='range'>between</option>
							</Input>
						</InputGroup>
					</FormGroup>
					{this.showCompared(min, max, compared)}
					<FormGroup>
						<Label>Notification message <a href="#" id="TooltipMessage">(more info)</a></Label><br/>
						<Tooltip placement="right" isOpen={this.state.tooltipOpen} target="TooltipMessage" toggle={this.toggle}>
							Placeholders: <br /><br />
							{'{aquarium}: will show the concerned aquarium name'} <br /><br />
							{'{attribute} (like {Iron}): will show the concerned value of, the specific attribute, put in by the user'}
						</Tooltip>
						<InputGroup>
							<Input type='text' value={message} onChange={this.changeMessage}/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label>Notification type</Label><br/>
						<InputGroup>
							<Input type='select' value={type} onChange={this.changeType}>
								<option value='Error'>Error</option>
								<option value='Warning'>Warning</option>
							</Input>
						</InputGroup>
					</FormGroup>
					<hr/>
					<Button onClick={this.changeNotificationRule} outline className='modalLink' color='secondary' block>Save changes</Button>
					<Button onClick={toggleModal} outline className='modalLink' color='secondary' block>Cancel</Button>
				</ModalBody>
			</div>
		);
	};
};
