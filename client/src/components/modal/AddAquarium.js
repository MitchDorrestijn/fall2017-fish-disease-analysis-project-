import React from 'react';
import {
	ModalHeader,
	ModalBody,
	Button,
	FormGroup,
	Label,
	InputGroup,
	InputGroupAddon,
	Input
} from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';

export default class AddAquarium extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			aquariumName: "",
			error: ""
		}
	}
	handleChange = (e) => {
		let aquariumName = e.target.value;
		this.setState({aquariumName: aquariumName})
  }
	aquariumNameForDB = (e) => {
		e.preventDefault();
		if(this.state.aquariumName === ""){
			this.setState({error: "Please fill in an aquarium name!"});
		} else {
			let da = new DataAccess();
			da.postData ('/aquaria/', {data: {name: this.state.aquariumName}}, (err, res) => {
				if (!err) {
					this.props.customProps.refreshPage();
					this.props.toggleModal();
				} else {
					this.setState({error: "Something went wrong, please try again."});
				}
			});
		}
	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Add aquarium</ModalHeader>
				<ModalBody>
					<p className="error">{this.state.error}</p>
					<FormGroup>
						<Label for="email">Aquarium name:</Label>
						<InputGroup>
							<InputGroupAddon><span className="fa fa-tint"></span></InputGroupAddon>
							<Input onChange={this.handleChange} name="aquariumName" type="text" placeholder="Aquarium name"/>
						</InputGroup>
					</FormGroup>
					<hr/>
					<Button onClick={this.aquariumNameForDB} outline className="modalLink" color="secondary" block>Add aquarium</Button>
				</ModalBody>
			</div>
		);
	}
}
