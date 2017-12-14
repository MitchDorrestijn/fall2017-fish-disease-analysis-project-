import React from 'react';
import { ModalHeader, ModalBody, Button, FormGroup, Label, InputGroup} from 'reactstrap';
import Error from './Error';
import 'react-select/dist/react-select.css';
import Select from "react-select";
import DataAccess from '../../scripts/DataAccess';

export default class AddFish extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			fishSpecies: [],
			availibleAquariums: [],
			selectedAquarium: "", //To display the selected aquaria in the input field
			selectedFish: "", //To display the selected fish in the input field
			dataToSendToDB: {},
			fishImage: null,
			error: ""
		}
	}
	componentDidMount(){
		this.loadSpecies();
		this.loadAquaria();
	}
	loadSpecies = () => {
		let da = new DataAccess();
		da.getData ('/species', (err, res) => {
			if (!err) {
				for (let elem of res.message) {
					this.setState({fishSpecies: [...this.state.fishSpecies, { value: elem.id, label: elem.name }]});
				}
			}
		});
	}
	loadAquaria = () => {
		let da = new DataAccess();
		da.getData ('/aquaria', (err, res) => {
			if (!err) {
				for (let elem of res.message) {
					this.setState({availibleAquariums: [...this.state.availibleAquariums, { value: elem.id, label: elem.name }]});
				}
			}
		});
	}
	selectFishSpecies = (val) => {
		let da = new DataAccess();
		da.getData(`/species/${val}`, (err, res) => {
			if (!err) {
				this.setState({fishImage: res.message.imageUrl});
			}
		});
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
		let aquariaId = this.state.objectToSendToDB.aquariumName;
		let specieName = this.state.objectToSendToDB.fishName;
		let da = new DataAccess();
		da.postData(`/aquaria/${aquariaId}/fish`, {data: {species: specieName}} , (err, res) => {
			if (!err) {
				this.props.customProps.refreshPage();
				this.props.toggleModal();
			} else {
				this.setState({error: "Something went wrong, please try again."})
			}
		});
	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Add fish</ModalHeader>
				<ModalBody>
					<p className="error">{this.state.error}</p>
					{this.state.fishImage && <figure><img className="img-fluid" src={this.state.fishImage} alt={this.state.fishImage}/></figure>}
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
