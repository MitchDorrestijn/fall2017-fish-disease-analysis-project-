import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, FormGroup, InputGroup, Input, Label} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class AddNotificationRule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {}
		};
		this.attributes = ["Phosphate", "Nitrate", "Nitrite", "Iron", "gH", "Temperature", "Oxygen", "Carbon", "Dioxide", "kH", "Chlorine"];
	}

	addNotificationRule = () => {
		this.postNotificationRule(this.state.data);
	};
	postNotificationRule = (dataObject) => {
		let da = new DataAccess ();
		da.postData('/notifications/rules', {rule: dataObject}, (err, res) => {
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

	showCompared = () => {
		if (this.state.data.equation === "range") {
			return (
				<FormGroup>
					<Label>Min</Label><br/>
					<InputGroup>
						<Input type="number" value={this.min} onChange={this.changeMin}/>
					</InputGroup>
					<Label>Max</Label><br/>
					<InputGroup>
						<Input type="number" value={this.max} onChange={this.changeMax}/>
					</InputGroup>
				</FormGroup>
			);
		} else {
			return (
				<FormGroup>
					<Label>Compared</Label><br/>
					<InputGroup>
						<Input type="number" value={this.compared} onChange={this.changeCompared}/>
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
							<Input type="select" value={attribute} onChange={this.changeAttribute}>
								<option selected disabled hidden>Choose here</option>
								{this.showAttributes()}
							</Input>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label>Equation</Label><br/>
						<InputGroup>
							<Input type="select" value={equation} onChange={this.changeEquation}>
								<option selected disabled hidden>Choose here</option>
								<option value=">">bigger than</option>
								<option value="<">smaller than</option>
								<option value="==">equal to</option>
								<option value="range">between</option>
							</Input>
						</InputGroup>
					</FormGroup>
					{this.showCompared()}
					<FormGroup>
						<Label>Notification message</Label><br/>
						<InputGroup>
							<Input type="text" value={message} onChange={this.changeMessage}/>
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
