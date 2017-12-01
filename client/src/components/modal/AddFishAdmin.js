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

class AddFishAdmin extends React.Component {
	addFish = (e) => {
		e.preventDefault();
		const fishName = e.target.fishname.value;
		const fishDescription = e.target.fishDescription.value;
		const fishImage = e.target.fishImage.value;
  	console.log(`Submitted form data: fishname: ${fishName}, fish description: ${fishDescription}, fish image: ${fishImage}`);
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
		          <Label for="fishName">Name of fish:</Label>
		          <Input id="fishname" type="text" name="fishName" placeholder="Name of fish" />
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

export default AddFishAdmin;
