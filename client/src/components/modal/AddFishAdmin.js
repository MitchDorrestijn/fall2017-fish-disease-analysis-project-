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
	constructor(props){
		super(props);
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
					<Form>
		        <FormGroup>
		          <Label for="fishName">Name of fish:</Label>
		          <Input type="text" name="fishName" placeholder="Name of fish" />
		        </FormGroup>
		        <FormGroup>
		          <Label for="fishDescription">Description of fish:</Label>
		          <Input type="textarea" name="fishDescription" />
		        </FormGroup>
						<FormGroup>
          		<Label for="exampleFile">Image</Label>
          		<Input type="file" name="fishImage" />
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
