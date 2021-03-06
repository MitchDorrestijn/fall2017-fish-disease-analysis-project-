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
import {Redirect} from 'react-router-dom';
import Error from './Error';
import DataAccess from '../../scripts/DataAccess';

export default class RemoveAquarium extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			aquariaFromDB: [],
			aquaria: [],
			error: false
		}
	}
	componentWillMount(){
		let da = new DataAccess();
		da.getData ('/aquaria/', (err, res) => {
			if (!err) {
				this.setState({ aquariaFromDB: [...this.state.aquariaFromDB, res.message] });
				this.getAquaria ();
			} else {
				this.setState({error: true});
			}
		});
	}
	getAquaria = () => {
		let aquaria = [];
		for(var key in this.state.aquariaFromDB[0]) {
			aquaria.push(<option key={key}>{this.state.aquariaFromDB[0][key].name}</option>);
		}
		this.setState ({
			aquaria: aquaria
		});
	}
	removeAquaria = (e) => {
		e.preventDefault();
		//This is where the API call for must take place to remove the selected auaria. Dont forget to call this.props.toggleModal(); in the res to close the modal.
		let selectedAquaria = document.getElementById("selectedAquaria").value;
		console.log(selectedAquaria);
	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Remove aquarium</ModalHeader>
				<ModalBody>
					{ this.state.error && "Something wnet wrong!"}
					<FormGroup>
						<Label for="email">Aquarium name:</Label>
          	<Input type="select" name="select" id="selectedAquaria">
							{this.state.aquaria}
          	</Input>
					</FormGroup>
					<hr/>
					<Button onClick={this.removeAquaria} outline className="modalLink" color="secondary" block>Remove aquarium</Button>
				</ModalBody>
			</div>
		);
	}
}
