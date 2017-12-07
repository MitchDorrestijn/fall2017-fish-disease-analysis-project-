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


export default class EditImageAddFish extends React.Component {
	addFishImage = () => {

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
