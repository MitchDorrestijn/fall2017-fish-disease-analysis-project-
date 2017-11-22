import React from 'react';
import { ModalHeader, ModalBody, Button, FormGroup, Label, InputGroup} from 'reactstrap';
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
			],
			selectedFish: ""
		}
	}
	selectFishSpecies = (val) => {
  	console.log('Selected: ', val);
		this.setState({selectedFish: val})
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
								name="form-field-name"
								value={this.state.selectedFish}
								className="selectField"
								options={this.state.fishSpecies}
								onChange={this.selectFishSpecies}
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
