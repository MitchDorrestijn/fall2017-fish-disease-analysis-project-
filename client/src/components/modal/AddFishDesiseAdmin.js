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

class AddFishADesiseAdmin extends React.Component {
	addFishDesise = (e) => {
		e.preventDefault();
		const fishName = e.target.fishName.value;
		const fishDescription = e.target.fishDescription.value;
		const fishSyntoms = e.target.fishSyntoms.value;
		const fishImage = e.target.fishImage.value;
		let allSyntoms = [];
		allSyntoms = fishSyntoms.split(",");
  	console.log(`Submitted form data: fishname: ${fishName}, fish description: ${fishDescription}, fish syntoms: ${allSyntoms}, fish image: ${fishImage}`);
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
		          <Label for="fishName">Name of fish:</Label>
		          <Input id="fishName" type="text" name="fishName" placeholder="Name of fish" />
		        </FormGroup>
						<FormGroup>
							<Label for="fishSyntoms">Syntoms:</Label>
							<Input id="fishSyntoms" type="text" name="fishSyntoms" placeholder="Desise synomes" />
							<FormText color="muted">Put a comma (,) to separate the syntoms.</FormText>
						</FormGroup>
		        <FormGroup>
		          <Label for="fishDescription">Description of fish:</Label>
		          <Input id="fishDescription" type="textarea" name="fishDescription" />
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

export default AddFishADesiseAdmin;
