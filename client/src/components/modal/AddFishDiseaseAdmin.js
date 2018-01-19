import React from 'react';
import {
	ModalHeader,
	ModalBody,
	Button,
	FormGroup,
	Label,
	Input,
	Form,
	FormText
} from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';

export default class AddFishADesiseAdmin extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			error: ""
		}
	}
	addFishDesise = (e) => {
		e.preventDefault();
		const diseasesName = e.target.diseasesName.value;
		const diseaseCode = e.target.diseaseCode.value;
		const diseasesDescription = e.target.diseasesDescription.value;
		const diseasesSyntoms = e.target.diseasesSyntoms.value;
		const diseasesTreatment = e.target.diseasesTreatment.value;
		let allSyntoms = [];
		allSyntoms = diseasesSyntoms.split(",");
		let diseaseInfo = {
			name: diseasesName,
			code: diseaseCode,
			symptoms: allSyntoms,
			description: diseasesDescription,
			treatment: diseasesTreatment
		}

		if(diseasesName === "" || diseasesDescription === "" || diseasesSyntoms === "" || diseasesTreatment === ""){
			this.setState({error: "Fill in all fields!"});
		} else if(diseasesName && diseaseCode && diseasesDescription && diseasesSyntoms && diseasesTreatment){
			let da = new DataAccess();
			da.postData ('/diseases/', {disease: diseaseInfo}, (err, res) => {
				if (!err) {
					this.props.customProps.refreshPage();
					this.props.toggleModal();
				} else {
					this.setState({error: "An error occurred !"});
				}
			});
		}
	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Add deisease</ModalHeader>
				<ModalBody>
					<p className="error">{this.state.error}</p>
					<Form onSubmit={this.addFishDesise}>
						<FormGroup>
							<Label for="diseasesName">Name:</Label>
							<Input id="diseasesName" type="text" name="diseasesName" placeholder="Type name here" />
						</FormGroup>
						<FormGroup>
							<Label for="diseaseCode">Code:</Label>
							<Input id="diseaseCode" type="text" name="diseaseCode" placeholder="Type code here" />
						</FormGroup>
						<FormGroup>
							<Label for="diseasesSyntoms">Symptoms:</Label>
							<Input id="diseasesSyntoms" type="text" name="diseasesSyntoms" placeholder="Type symptoms here" />
							<FormText color="muted">Put a comma (,) to separate the symptoms.</FormText>
						</FormGroup>
						<FormGroup>
							<Label for="diseasesDescription">Description:</Label>
							<Input id="diseasesDescription" type="textarea" name="diseasesDescription" placeholder="Type description here" />
						</FormGroup>
						<FormGroup>
							<Label for="diseasesTreatment">Treatment:</Label>
							<Input id="diseasesTreatment" type="textarea" name="diseasesTreatment" placeholder="Type treatment here" />
						</FormGroup>
						<Button>Submit</Button>
					</Form>
				</ModalBody>
			</div>
		);
	}
}
