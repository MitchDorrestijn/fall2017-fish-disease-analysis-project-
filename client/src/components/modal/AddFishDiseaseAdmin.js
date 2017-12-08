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
import Error from './Error';
import DataAccess from '../../scripts/DataAccess';

class AddFishADesiseAdmin extends React.Component {
	addFishDesise = (e) => {
		e.preventDefault();
		const diseasesName = e.target.diseasesName.value;
		const diseasesDescription = e.target.diseasesDescription.value;
		const diseasesSyntoms = e.target.diseasesSyntoms.value;
		//const fishImage = e.target.fishImage.value;
		const diseasesTreatment = e.target.diseasesTreatment.value;
		let allSyntoms = [];
		allSyntoms = diseasesSyntoms.split(",");
  	//console.log(`Submitted form data: fishname: ${diseasesName}, fish description: ${diseasesDescription}, fish syntoms: ${allSyntoms}, fish treatment: ${diseasesTreatment}`);

		let diseaseInfo = {
			name: diseasesName,
			symptoms: allSyntoms,
			description: diseasesDescription,
			treatment: diseasesTreatment
		}
		console.log(diseaseInfo);

		let da = new DataAccess();
		da.postData ('/diseases/', {disease: diseaseInfo}, (err, res) => {
			if (!err) {
				this.props.toggleModal();
			} else {
				console.log('error');
			}
		});




	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Add fish desise</ModalHeader>
				<ModalBody>
					{ this.props.isErrorVisible ?
						<Error errorContent={this.props.errorContent} /> :
						null
					}
					<Form onSubmit={this.addFishDesise}>
		        <FormGroup>
		          <Label for="diseasesName">Name:</Label>
		          <Input id="diseasesName" type="text" name="diseasesName" placeholder="Name of diseases" />
		        </FormGroup>
						<FormGroup>
							<Label for="diseasesSyntoms">Syntoms:</Label>
							<Input id="diseasesSyntoms" type="text" name="diseasesSyntoms" placeholder="Desise synomes" />
							<FormText color="muted">Put a comma (,) to separate the syntoms.</FormText>
						</FormGroup>
		        <FormGroup>
		          <Label for="diseasesDescription">Description:</Label>
		          <Input id="diseasesDescription" type="textarea" name="diseasesDescription" />
		        </FormGroup>
						<FormGroup>
		          <Label for="diseasesTreatment">Treatment:</Label>
		          <Input id="diseasesTreatment" type="textarea" name="diseasesTreatment" />
		        </FormGroup>
						{/* <FormGroup>
          		<Label for="fishImage">Image</Label>
          		<Input id="fishImage" type="file" name="fishImage" />
          		<FormText color="muted">Images can be uploaded in .jpg and .png.</FormText>
        		</FormGroup> */}
		        <Button>Submit</Button>
		      </Form>
				</ModalBody>
			</div>
		);
	}
}

export default AddFishADesiseAdmin;
