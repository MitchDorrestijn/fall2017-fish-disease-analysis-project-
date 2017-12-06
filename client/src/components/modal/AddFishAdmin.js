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

class AddFishAdmin extends React.Component {
	addFish = (e) => {
		e.preventDefault();
		const fishToAdd = {
			name: e.target.fishname.value,
			info: e.target.fishDescription.value,
			additional: e.target.fishAdditional.value,
			picture: e.target.fishImage.value
		}
		let da = new DataAccess();
		da.postData(`/species`, {species: fishToAdd},  (err, res) => {
			if (!err.status) {
				this.props.customProps.refreshPage();
				this.props.toggleModal();
			} else {
				console.log(err);
			}
		});
	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Add fish</ModalHeader>
				<ModalBody>
					{ this.props.isErrorVisible ?
						<Error errorContent={this.props.errorContent} /> :
						null
					}
					<Form onSubmit={this.addFish}>
		        <FormGroup>
		          <Label for="fishName">Name:</Label>
		          <Input id="fishname" type="text" name="fishName" placeholder="Name of fish" />
		        </FormGroup>
		        <FormGroup>
		          <Label for="fishDescription">Description:</Label>
		          <Input id="fishDescription" type="textarea" name="fishDescription" />
		        </FormGroup>
						<FormGroup>
							<Label for="fishAdditional">Additional:</Label>
							<Input id="fishAdditional" type="textarea" name="fishAdditional" />
						</FormGroup>
						<FormGroup>
          		<Label for="fishImage">Image</Label>
          		<Input id="fishImage" type="file" name="fishImage" />
          		<FormText color="muted">Images can be uploaded in .jpg and .png.</FormText>
        		</FormGroup>
		        <Button>Submit</Button>
		      </Form>
				</ModalBody>
			</div>
		);
	}
}

export default AddFishAdmin;
