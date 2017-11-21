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

class Register extends React.Component {
	registerUser = () => {
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		const repeatpassword = document.getElementById("repeatpassword").value;
		const firstName = document.getElementById("firstName").value;
		const lastName = document.getElementById("lastName").value;
		const country = document.getElementById("country").value;
		
		
		if(password === repeatpassword){
			if(email){
				this.props.userRegister(
										email,
										password,
										firstName,
										lastName,
										country
				);
			}else{
				this.props.showError(true, "Not all fields are filled in");
			}
		}else{
			this.props.showError(true, "Password is not the same");
		}
	};
	
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Create an account</ModalHeader>
				<ModalBody>
					{ this.props.isErrorVisible ?
						<Error errorContent={this.props.errorContent} /> :
						null
					}
					
					<FormGroup>
						<Label for="email">Email address</Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-user"/></InputGroupAddon>
							<Input type="email" id="email" placeholder="Email address"/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="password">Password</Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-lock"/></InputGroupAddon>
							<Input type="password" id="password" placeholder="Password"/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="repeatpassword">Repeat password</Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-lock"/></InputGroupAddon>
							<Input type="password" id="repeatpassword" placeholder="Repeat password"/>
						</InputGroup>
					</FormGroup>
					<hr/>
					<FormGroup>
						<Label for="firstName">Firstname</Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-address-card"/></InputGroupAddon>
							<Input id="firstName" placeholder="Firstname"/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="lastName">Lastname</Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-address-card"/></InputGroupAddon>
							<Input id="lastName" placeholder="Lastname"/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="country">Country</Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-globe"/></InputGroupAddon>
							<Input type="select" name="select" id="country">
								<option value="Netherlands">Netherlands</option>
								<option>2</option>
								<option>3</option>
								<option>4</option>
								<option>5</option>
							</Input>
						</InputGroup>
					</FormGroup>
					<hr/>
					<Button outline className="modalLink" color="secondary" onClick={() => this.registerUser()} block>Create account</Button>
					
					<p className="center">
						Already have an account? <u><a className="modalLink" onClick={() => this.props.openModal(Login)}>Login</a></u>
					</p>
				</ModalBody>
			</div>
		);
	}
}

export default Register;