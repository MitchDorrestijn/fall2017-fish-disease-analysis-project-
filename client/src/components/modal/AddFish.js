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
			selectedFish: "", //To display the selected fish in the input field
			dataToSendToDB: {},
			fishImage: null,
			error: "",
			disabled: false,
			currentAquarium: this.props.customProps.currentAquarium
		}
	}
	componentDidMount(){
		this.loadSpecies();
	}
	loadSpecies = () => {
		let da = new DataAccess();
		let fishSpecies = [];
		da.getData ('/species', (err, res) => {
			if (!err) {
				for (let elem of res.message) {
					fishSpecies.push({ value: elem.id, label: elem.name })
				}
				for(let i=0; i<this.props.customProps.fishInAquaria.fish.length; i++){
					if(this.contains(fishSpecies, this.props.customProps.fishInAquaria.fish[i].species.name)){
						fishSpecies.splice(fishSpecies[i], 1);
						i--;
					}
				}
				this.setState({fishSpecies: fishSpecies});
			}
		});
	}
	contains = (a, obj) => {
    let i = a.length;
    while (i--) {
  		if (a[i].label === obj) {
      	return true;
       }
    }
    return false;
	}
	selectFishSpecies = (val) => {
		let da = new DataAccess();
		da.getData(`/species/${val}`, (err, res) => {
			if (!err) {
				this.setState({fishImage: res.message.imageUrl});
			}
		});
		let selectedData = {
			fishName: val
		}
		this.setState({selectedFish: val, objectToSendToDB: selectedData});
	}
	addFish = () => {
		this.setState({disabled: true});
		let aquariaId =  this.state.currentAquarium;
		if(this.state.objectToSendToDB){
			let specieName = this.state.objectToSendToDB.fishName;
			let da = new DataAccess();
			console.log(aquariaId);
			console.log(specieName);
			da.postData(`/aquaria/${aquariaId}/fish`, {fish: {species: specieName}} , (err, res) => {
				if (!err) {
					this.props.customProps.refreshPage();
					this.props.toggleModal();
				} else {
					this.setState({error: "Something went wrong, please select a aqarium and try again."})
				}
			});
		} else {
			this.setState({error: "Please provide a fish name."});
		}
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
					</FormGroup>
					<hr/>
					<Button disabled={this.state.disabled} onClick={this.addFish} outline className="modalLink" color="secondary" block>Add fish</Button>
				</ModalBody>
			</div>
		);
	}
}
