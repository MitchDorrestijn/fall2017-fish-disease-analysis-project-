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
		 // let formData = new FormData();
		 // formData.append('fishImage', document.getElementById("fishImage").files[0], 'naamVanGeuploadeAfbeelding.jpg');
     //
     //
		 // formData.append('fishImage', document.getElementById("fishImage").prop('files')[0]);

		 //console.log(formData);
		// $('#uploadBtn').click((e) => {
    //                let formData = new FormData();
    //                formData.append('fishImage', $('#fishImage').prop('files')[0]);
    //                $.ajax({
    //                    url: 'http://localhost:5000/api/species/mQovDDr3IpGJYtW5w0z2/upload',
    //                    beforeSend: function(request) {
    //                        request.setRequestHeader("Authorization", "Token " + idToken);
    //                    },
    //                    data: formData,
    //                    type: 'POST',
    //                    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
    //                    processData: false, // NEEDED, DON'T OMIT THIS
    //                    // ... Other options like success and etc
    //                });
    //            })

	}

	handleFiles = (files) => {
  console.log(files)
}


	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Change/add fish image</ModalHeader>
				<ModalBody>
					<Form onSubmit={this.addFishImage}>
						{/* <FormGroup>
          		<Label for="fishImage">Image</Label>
          		<Input id="fishImage" type="file" name="fishImage" />
          		<FormText color="muted">Images can be uploaded in .jpg and .png.</FormText>
        		</FormGroup> */}

						<ReactFileReader handleFiles={this.handleFiles}>
							<button className='btn'>Upload</button>
						</ReactFileReader>


		        <Button>Submit</Button>
		      </Form>
				</ModalBody>
			</div>
		);
	}
}
