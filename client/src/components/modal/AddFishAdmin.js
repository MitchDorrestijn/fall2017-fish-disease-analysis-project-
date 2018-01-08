import React from 'react';
import {
	ModalHeader,
	ModalBody,
	Button,
	FormGroup,
	Label,
	Input,
	Form
} from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';

export default class AddFishAdmin extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			error: ""
		}
	}
	addFish = (e) => {
		e.preventDefault();
		const fishToAdd = {
			name: document.getElementById("fishname").value,
			info: document.getElementById("fishDescription").value,
			additional: document.getElementById("fishAdditional").value
		}
		if(fishToAdd.name === "" || fishToAdd.info === "" || fishToAdd.additional === ""){
			this.setState({error: "Fill in all fields!"});
		} else if(fishToAdd.name && fishToAdd.info && fishToAdd.additional){
			let da = new DataAccess();
			da.postData(`/species`, {species: fishToAdd},  (err, res) => {
				if (!err.status) {
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
				<ModalHeader toggle={() => this.props.toggleModal()}>Add fish</ModalHeader>
				<ModalBody>
					<p className="error">{this.state.error}</p>
					<Form onSubmit={this.addFish}>
		        <FormGroup>
		          <Label for="fishName">Name:</Label>
		          <Input id="fishname" type="text" name="fishName" placeholder="Fish name" />
		        </FormGroup>
		        <FormGroup>
		          <Label for="fishDescription">Description:</Label>
		          <Input id="fishDescription" type="textarea" name="fishDescription" placeholder="Fish description" />
		        </FormGroup>
						<FormGroup>
							<Label for="fishAdditional">Additional:</Label>
							<Input id="fishAdditional" type="textarea" name="fishAdditional" placeholder="Additional fish information"/>
						</FormGroup>
		        <Button>Submit</Button>
		      </Form>
				</ModalBody>
			</div>
		);
	}
}
