import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, Input, Form, FormGroup, Label, FormText} from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';

export default class EditDisease extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: "",
			symptoms: "",
			description: "",
			treatment: ""
		}
	}
	componentWillMount(){
		this.setState({
			name: this.props.customProps.entry.name,
			symptoms: this.props.customProps.entry.symptoms.toString(),
			description: this.props.customProps.entry.description,
			treatment: this.props.customProps.entry.treatment
		});
	}
	editDisease = (e) => {
		e.preventDefault();
		const diseaseData = {
			name: this.state.name,
			symptoms: this.state.symptoms.split(","),
			description: this.state.description,
			treatment: this.state.treatment
		};
		console.log (this.props.customProps.entry.id);
		console.log (diseaseData);
		let da = new DataAccess();
		da.putData(`/diseases/${this.props.customProps.entry.id}`, {disease: diseaseData},  (err, res) => {
			if (!err) {
				this.props.toggleModal();
				this.props.customProps.refreshPage();
			} else {
				console.log('error');
			}
		});
	};
	changeName = (e) => {
		this.setState({name: e.target.value});
	}
	changeSymptoms = (e) => {
		this.setState({symptoms: e.target.value});
	}
	changeDescription = (e) => {
		this.setState({description: e.target.value});
	}
	changeTreatment = (e) => {
		this.setState({treatment: e.target.value});
	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Edit Disease</ModalHeader>
				<ModalBody>
					<Form onSubmit={this.editDisease}>
						<FormGroup>
							<Label for="diseasesName">Name:</Label>
							<Input id="diseasesName" type="text" name="diseasesName" placeholder="Name of diseases" value={this.state.name} onChange={this.changeName} />
						</FormGroup>
						<FormGroup>
							<Label for="diseasesSyntoms">Syntoms:</Label>
							<Input id="diseasesSyntoms" type="text" name="diseasesSyntoms" placeholder="Desise synomes" value={this.state.symptoms} onChange={this.changeSymptoms} />
							<FormText color="muted">Put a comma (,) to separate the syntoms.</FormText>
						</FormGroup>
						<FormGroup>
							<Label for="diseasesDescription">Description:</Label>
							<Input id="diseasesDescription" type="textarea" name="diseasesDescription" value={this.state.description} onChange={this.changeDescription} />
						</FormGroup>
						<FormGroup>
							<Label for="diseasesTreatment">Treatment:</Label>
							<Input id="diseasesTreatment" type="textarea" name="diseasesTreatment" value={this.state.treatment} onChange={this.changeTreatment} />
						</FormGroup>
						<Button>Edit</Button>
					</Form>
				</ModalBody>
			</div>
		);
	}
}
