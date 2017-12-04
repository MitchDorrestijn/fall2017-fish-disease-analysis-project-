import React from 'react';
import { ModalHeader, ModalBody, Button, FormGroup, Label, InputGroup} from 'reactstrap';
import Error from './Error';
import 'react-select/dist/react-select.css';
import Select from "react-select";

class AddFish extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			fishSpecies: [ //Fishes from the database
	  		{ value: 'Goldfish', label: 'Goldfish' },
	  		{ value: 'Catfish', label: 'Catfish' }
			],
			availibleAquariums: [ //Aquaria from the database for this user
	  		{ value: 'Aquarium1', label: 'Aquarium1' },
	  		{ value: 'Aquarium2', label: 'Aquarium2' }
			],
			selectedAquarium: "", //To display the selected aquaria in the input field
			selectedFish: "", //To display the selected fish in the input field
			dataToSendToDB: {}
		}
	}

	selectFishSpecies = (val) => {
		let selectedData = {
			aquariumName: this.state.selectedAquarium,
			fishName: val
		}
		this.setState({selectedFish: val, objectToSendToDB: selectedData});
	}
	getSelectedAquarium = (val) => {
		let selectedData = {
			aquariumName: val,
			fishName: this.state.selectedFish
		}
		this.setState({selectedAquarium: val, objectToSendToDB: selectedData})
	}
	addFish = () => {
		console.log(this.state.objectToSendToDB);
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
								simpleValue={true}
								name="addfish"
								value={this.state.selectedFish}
								className="selectField"
								options={this.state.fishSpecies}
								onChange={this.selectFishSpecies}
							/>
						</InputGroup>
						<Label for="addfishtoaquarium">Add fish to aquarium:</Label>
						<InputGroup>
							<Select
								simpleValue={true}
								name="addfishtoaquarium"
								value={this.state.selectedAquarium}
								className="selectField"
								options={this.state.availibleAquariums}
								onChange={this.getSelectedAquarium}
							/>
						</InputGroup>
					</FormGroup>
					<hr/>
					<Button onClick={this.addFish} outline className="modalLink" color="secondary" block>Add fish</Button>
				</ModalBody>
			</div>
		);
	}
}

export default AddFish;
