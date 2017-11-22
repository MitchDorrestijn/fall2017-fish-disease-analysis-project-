import React from 'react';
import { ModalHeader, ModalBody, Button, FormGroup, Label, InputGroup } from 'reactstrap';
import Error from './Error';
import 'react-select/dist/react-select.css';
import Select from "react-select";


class AddFish extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			fishSpecies: [
	  		{ value: 'Goldfish', label: 'Goldfish' },
	  		{ value: 'Catfish', label: 'Catfish' }
			]
		}
	}
	selectedFishSpecies = (val) => {
  	console.log('Selected fish: ', val);
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
					<FormGroup>
						<Label for="addfish">Name of fish:</Label>
						<InputGroup>
							<Select
								name="form-field-name"
								simpleValue={true}
								value="one"
								placeholder="Type your fish species here."
								className="selectField"
								options={this.state.fishSpecies}
								onChange={this.selectedFishSpecies}
							/>
						</InputGroup>
					</FormGroup>
					<hr/>
					<Button outline className="modalLink" color="secondary" block>Add fish</Button>
				</ModalBody>
			</div>
		);
	}
}

export default AddFish;
