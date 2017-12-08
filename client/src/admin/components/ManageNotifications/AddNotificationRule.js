import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, FormGroup, InputGroup, Input, Label} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class AddNotificationRule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.customProps
		};
		this.attributes = ["Phosphate", "Nitrate", "Nitrite", "Iron", "gH", "Temperature", "Oxygen", "Carbon", "Dioxide", "kH", "Chlorine"];
	}

	addNotificationRule = () => {
		if (this.state.data.equation === "range") {
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

	changeData = (field, evt) => {
		let data = this.state.data;
		data[field] = evt.target.value;
		this.setState({
			data: data
		});
	};

	changeAttribute = (evt) => {
		this.changeData("attribute", evt);
	};

	changeEquation = (evt) => {
		this.changeData("equation", evt);
	};

	changeCompared = (evt) => {
		this.changeData("compared", evt);
	};

	changeMin = (evt) => {
		this.changeData("min", evt);
	};

	changeMax = (evt) => {
		this.changeData("max", evt);
	};

	changeMessage = (evt) => {
		this.changeData("message", evt);
	};

	showAttributes = () => {
		let options = [];
		this.attributes.forEach( (value, index) => {
			options.push(<option key={index} value={value}>{value}</option>)
		});
		return options
	};

	showCompared = (min, max, compared) => {
		if (this.state.data.equation === "range") {
			return (
				<FormGroup key="0">
					<Label>Min</Label><br/>
					<InputGroup>
						<Input type="number" value={min} onChange={this.changeMin}/>
					</InputGroup>
					<Label>Max</Label><br/>
					<InputGroup>
						<Input type="number" value={max} onChange={this.changeMax}/>
					</InputGroup>
				</FormGroup>
			);
		} else {
			return (
				<FormGroup key="0">
					<Label>Compared</Label><br/>
					<InputGroup>
						<Input type="number" value={compared} onChange={this.changeCompared}/>
					</InputGroup>
				</FormGroup>
			);
		};
	};

	render() {
		const {attribute, equation, compared, min, max, message} = this.state.data;
		const {toggleModal} = this.props;
		return (
			<div>
				<ModalHeader toggle={toggleModal}>Change notification rule</ModalHeader>
				<ModalBody>
					<FormGroup>
						<Label>Attribute</Label><br/>
						<InputGroup>
							<Input type="select" onChange={this.changeAttribute}>
								<option selected disabled hidden>Choose here</option>
								{this.showAttributes()}
							</Input>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label>Equation</Label><br/>
						<InputGroup>
							<Input type="select" onChange={this.changeEquation}>
								<option selected disabled hidden>Choose here</option>
								<option value=">">bigger than</option>
								<option value="<">smaller than</option>
								<option value="==">equal to</option>
								<option value="range">between</option>
							</Input>
						</InputGroup>
					</FormGroup>
					{this.showCompared(min, max, compared)}
					<FormGroup>
						<Label>Notification message</Label><br/>
						<InputGroup>
							<Input type="text" onChange={this.changeMessage}/>
						</InputGroup>
					</FormGroup>
					<hr/>
					<Button onClick={this.addNotificationRule} outline className="modalLink" color="secondary" block>Add notification rule</Button>
					<Button onClick={toggleModal} outline className="modalLink" color="secondary" block>Cancel</Button>
				</ModalBody>
			</div>
		);
	}
}
