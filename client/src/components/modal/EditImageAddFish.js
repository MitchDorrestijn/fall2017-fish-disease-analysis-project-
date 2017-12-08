import 'whatwg-fetch';
import * as firebase from 'firebase';
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
import ReactFileReader from 'react-file-reader';

export default class EditImageAddFish extends React.Component {
	addFishImage = (e) => {
		e.preventDefault();
		const inputElement = document.getElementById('fishImage');
		const file = inputElement.files[0];
		let formData = new FormData();
		formData.append('image', file);
		firebase.auth ().currentUser.getIdToken ().then ((result) => {
			const token = result;
			fetch(`http://localhost:5000/api/species/${this.props.customProps.entry.id}/upload`, {
	   			method: 'POST',
	   			headers: {
			 			'Authorization': 'Token ' + token
	   			},
		 			mode: 'cors',
	   			body: formData
			}).then(() => {
				this.props.customProps.refreshPage();
				this.props.toggleModal();
			}).catch ((error) => {
					console.log(error);
			});
		});
	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Change/add fish image</ModalHeader>
				<ModalBody>
					<Form onSubmit={this.addFishImage}>
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
