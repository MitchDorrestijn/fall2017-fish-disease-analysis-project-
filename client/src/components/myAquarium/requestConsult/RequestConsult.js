import React from 'react';
import {Col, Input, InputGroup, Button, Alert, Card, CardBody, CardTitle, CardText, FormGroup, Label, CardSubtitle} from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import UserService from '../../../provider/user-data-service';
import Error from '../../modal/Error';
import * as firebase from 'firebase';
import CountrySelect from '../../modal/CountrySelect';
import DataAccess from '../../../scripts/DataAccess';

//TODO: refactor country select to controlled component
export default class AccountSettings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			availableDates: []
		};
	};
	//component mount/unmount functions:
	componentWillMount() {
		//this.initSetters();
	};
	//get/post data functions:
	registerRequest = () => {
		const appointment = {
			date: document.getElementById("dateTime").value,
			comment: document.getElementById("comment").value
		};
		Object.keys(Request).forEach( (key) => {
			if (Request[key] === "") {
				delete Request[key];
			};
		});
		this.postRequest(Request);
	};
	postRequest = (dataObject) => {
		let da = new DataAccess ();
		da.postData(`/aquaria/${this.props.customProps.aquariumId}/entries`, {entry: dataObject}, (err, res) => {
			if (!err) {
				this.props.customProps.refreshPage();
				this.props.toggleModal();
			} else {
				console.log(err);
			};
		});
	};
	//get/post data functions:
	initSetters = () => {
		let da = new DataAccess ();
		da.getData ('/aquaria', (err, res) => {
			this.setCreatedAquariums(res.message);
			if (!err) {
			} else {
			};
		});
	};
	fillDateSelector = () => {
		let options = [];
		for(let key in this.state.availableDates) {
			if(this.state.availableDates.hasOwnProperty(key)) {
				options.push(<option key={key} value={this.state.availableDates[key].id}>{this.state.availableDates[key].name}</option>);
			};
		};
		return options;
	};

	render() {
		return (
			<div className="account-settings">
				<Col>
					<h1 className="center">Current registered consults.</h1>
				</Col>
				<div className="container">
					<div className="row inner-content">
						<div className="col-md-12 no-gutter">
							<Col>
								<Card>
									<CardBody>
										<CardTitle>Consult on: 27-01-2018</CardTitle>
										<CardSubtitle>Comment:</CardSubtitle>
										<CardText>De analyse zegt dat mijn vis een ziekte heeft maar ik weet van de ziekte niks af.</CardText>
									</CardBody>
								</Card>
							</Col>
							<Col>
								<h1 className="center">Register new consult.</h1>
							</Col>
							<Col>
								<Card>
									<CardBody>
										<FormGroup>
											<Label for="exampleSelect">Select date/time</Label>
											<Input type="select" name="select" id="dateTime">
												{this.fillDateSelector()}
											</Input>
										</FormGroup>
										<FormGroup>
											<Label for="exampleText">Comment:</Label>
											<Input type="textarea" name="text" id="comment" />
										</FormGroup>
										<div className="text-right">
											<ActionButton buttonText="Register consult" onClick={this.registerRequest} color="primary btn-transperant"/>
										</div>
									</CardBody>
								</Card>
							</Col>
						</div>
					</div>
				</div>
			</div>
		);
	};
};
