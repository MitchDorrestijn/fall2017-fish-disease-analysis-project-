import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, FormGroup, InputGroup, Input, Label} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class ChangeNotificationRule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.customProps.entry
		};
		this.attributes = ['Phosphate', 'Nitrate', 'Nitrite', 'Iron', 'gH', 'Temperature', 'Oxygen', 'Carbon', 'Dioxide', 'kH', 'Chlorine'];
	}

	changeNotificationRule = () => {
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

	showAttributes = () => {
		let options = [];
		this.attributes.forEach( (value, index) => {
			options.push(<option key={index} value={value}>{value}</option>)
		});
		return options
	};

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
						<Label>Notification message</Label><br/>
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
	}
}
