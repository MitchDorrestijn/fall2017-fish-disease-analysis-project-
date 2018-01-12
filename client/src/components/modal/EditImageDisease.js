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
import DataAccess from '../../scripts/DataAccess';

export default class EditImageDisease extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			error: ""
		}
	}
	addFishImage = (e) => {
		e.preventDefault();
		const inputElement = document.getElementById('diseaseImage');

		if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(inputElement.value)){
			const file = inputElement.files[0];
			let formData = new FormData();
			formData.append('image', file);
			firebase.auth ().currentUser.getIdToken ().then ((result) => {
				const token = result;
				let da = new DataAccess();
				fetch(`${da.getApi()}/diseases/${this.props.customProps.entry.id}/upload`, {
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
						this.setState({error: "An error occurred " + error});
				});
			});
		} else {
			this.setState({error: "Please upload a .GIF, .JPG, .JPEG, .TIFF or .PNG image."})
		}
	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Change/add disease image</ModalHeader>
				<ModalBody>
					<p className="error">{this.state.error}</p>
					<Form onSubmit={this.addFishImage}>
						<FormGroup>
							<Label for="diseaseImage">Image</Label>
							<Input id="diseaseImage" type="file" name="diseaseImage" />
							<FormText color="muted">Images can be uploaded in .jpg and .png.</FormText>
						</FormGroup>
						<Button>Submit</Button>
					</Form>
				</ModalBody>
			</div>
		);
	}
}
