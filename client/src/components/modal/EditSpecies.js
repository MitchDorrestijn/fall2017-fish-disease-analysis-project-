import React, {Component} from 'react';
import {Button, ModalHeader, ModalBody, Input, Form, FormGroup, Label, FormText} from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';

export default class EditSpecies extends Component {
	constructor(props){
		super(props);
		this.state = {
			name: "",
			info: "",
			additional: "",
			picture: ""
		}
	}
	componentWillMount(){
		this.setState({
			name: this.props.customProps.entry.name,
			info: this.props.customProps.entry.info,
			additional: this.props.customProps.entry.additional,
			picture: this.props.customProps.entry.picture
		});
	}
	editSpecies = (e) => {
		e.preventDefault();
		let speciesData = {
			name: this.state.name,
			info: this.state.info,
			additional: this.state.additional,
			picture: this.state.picture
		};
		for (let key in speciesData) {
			if (!speciesData[key]) {
				delete speciesData[key];
			}
		}
		let da = new DataAccess();
		da.putData(`/species/${this.props.customProps.entry.id}`, {species: speciesData},  (err, res) => {
			if (!err) {
				this.props.toggleModal();
				this.props.customProps.refreshPage();
			} else {
				console.log('error');
			}
		});
	};
	changeName = (e) => {
		this.setState({name: e.target.value});
	}
	changeInfo = (e) => {
		this.setState({info: e.target.value});
	}
	changeAdditional = (e) => {
		this.setState({additional: e.target.value});
	}
	changePicture = (e) => {
		this.setState({picture: e.target.value});
	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Edit {this.state.name}</ModalHeader>
				<ModalBody>
					<Form onSubmit={this.editSpecies}>
						<FormGroup>
							<Label for="speciesName">Name:</Label>
							<Input id="speciesName" type="text" name="speciesName" value={this.state.name} onChange={this.changeName} />
						</FormGroup>
						<FormGroup>
							<Label for="speciesInfo">Info:</Label>
							<Input id="speciesInfo" type="textarea" name="speciesInfo" value={this.state.info} onChange={this.changeInfo} />
						</FormGroup>
						<FormGroup>
							<Label for="speciesAdditional">Additional:</Label>
							<Input id="speciesAdditional" type="textarea" name="speciesAdditional" value={this.state.additional} onChange={this.changeAdditional} />
						</FormGroup>
						<FormGroup>
          		<Label for="speciesPicture">Image</Label>
          		<Input id="speciesPicture" type="file" name="speciesPicture" />
          		<FormText color="muted">Images can be uploaded in .jpg and .png.</FormText>
        		</FormGroup>
						<Button>Edit</Button>
					</Form>
				</ModalBody>
			</div>
		);
	}
}