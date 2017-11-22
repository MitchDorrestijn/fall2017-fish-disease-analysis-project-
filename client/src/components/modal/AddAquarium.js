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
import Error from './Error';

class Login extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			aquariumName: ""
		}
	}
	handleChange = (e) => {
		let aquariumName = e.target.value;
		this.setState({aquariumName: aquariumName})
  }
	aquariumNameForDB = (e) => {
		e.preventDefault();
		console.log(this.state.aquariumName);
	}
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Add aquarium</ModalHeader>
				<ModalBody>
					{ this.props.isErrorVisible ?
						<Error errorContent={this.props.errorContent} /> :
						null
					}
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
