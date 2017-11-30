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

class Login extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			aquariumName: "",
			error: false
		}
	}
	handleChange = (e) => {
		let aquariumName = e.target.value;
		this.setState({aquariumName: aquariumName})
  }
	aquariumNameForDB = (e) => {
		e.preventDefault();
		console.log(this.state.aquariumName);

			let da = new DataAccess();
			da.postData ('/aquaria/', {data: {name: this.state.aquariumName}}, (err, res) => {
				if (!err) {
					this.props.customProps.refreshPage();
					this.props.toggleModal();
				} else {
					this.setState({error: true});
				}
			});
	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Add aquarium</ModalHeader>
				<ModalBody>
					{ this.state.error && "Something wnet wrong!"}
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

export default Login;
