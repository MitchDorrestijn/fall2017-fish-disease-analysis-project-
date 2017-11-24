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
import Login from './Login';
import Error from './Error';
import CountrySelect from './CountrySelect';
import Translate from 'translate-components';

class Register extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			country: ""
		};
	}

	registerUser = () => {
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		const repeatpassword = document.getElementById("repeatpassword").value;
		const firstName = document.getElementById("firstName").value;
		const lastName = document.getElementById("lastName").value;
		const country = document.getElementById("country").value;
		
		if(email && password && repeatpassword && firstName && lastName && country){
			if(password === repeatpassword){
				this.props.userRegister(
										email,
										password,
										firstName,
										lastName,
										country
				);
			}else{
				this.props.showError(true, "Password is not the same");
			}
		}else{
			this.props.showError(true, "Not all fields are filled in");
		}
	};

	changeCountry = (evt) => {
		this.setState({
			country: evt.target.value
		});
	};

	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}><Translate>Create an account</Translate></ModalHeader>
				<ModalBody>
					{ this.props.isErrorVisible ?
						<Error errorContent={this.props.errorContent} /> :
						null
					}
					
					<FormGroup>
						<Label for="email"><Translate>Email address</Translate></Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-user"/></InputGroupAddon>
							<Input type="email" id="email" placeholder="Email address"/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="password"><Translate>Password</Translate></Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-lock"/></InputGroupAddon>
							<Input type="password" id="password" placeholder="Password"/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="repeatpassword"><Translate>Repeat password</Translate></Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-lock"/></InputGroupAddon>
							<Input type="password" id="repeatpassword" placeholder="Repeat password"/>
						</InputGroup>
					</FormGroup>
					<hr/>
					<FormGroup>
						<Label for="firstName"><Translate>Firstname</Translate></Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-address-card"/></InputGroupAddon>
							<Input id="firstName" placeholder="Firstname"/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="lastName"><Translate>Lastname</Translate></Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-address-card"/></InputGroupAddon>
							<Input id="lastName" placeholder="Lastname"/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="country"><Translate>Country</Translate></Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-globe"/></InputGroupAddon>
							<CountrySelect function={this.changeCountry} country={this.state.country}/>
						</InputGroup>
					</FormGroup>
					<hr/>
					<Button outline className="modalLink" color="secondary" onClick={() => this.registerUser()} block><Translate>Create account</Translate></Button>
					
					<p className="center">
						<Translate>Already have an account?</Translate> <u><a className="modalLink" onClick={() => this.props.openModal(Login)}><Translate>Login</Translate></a></u>
					</p>
				</ModalBody>
			</div>
		);
	}
}

export default Register;