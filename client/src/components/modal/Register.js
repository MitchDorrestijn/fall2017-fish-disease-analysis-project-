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

class Register extends React.Component {
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Create an account</ModalHeader>
				<ModalBody>
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
							<Input type="repeatpassword" id="password" placeholder="Repeat password"/>
						</InputGroup>
					</FormGroup>
					<hr/>
					<FormGroup>
						<Label for="firstname">Firstname</Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-address-card"/></InputGroupAddon>
							<Input id="firstname" placeholder="Firstname"/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="lastname">Lastname</Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-address-card"/></InputGroupAddon>
							<Input id="lastname" placeholder="Lastname"/>
						</InputGroup>
					</FormGroup>
					<FormGroup>
						<Label for="country">Country</Label>
						<InputGroup>
							<InputGroupAddon><i className="fa fa-globe"/></InputGroupAddon>
							<Input type="select" name="select" id="country">
								<option>1</option>
								<option>2</option>
								<option>3</option>
								<option>4</option>
								<option>5</option>
							</Input>
						</InputGroup>
					</FormGroup>
					<hr/>
					<Button outline className="modalLink" color="secondary" onClick={() => this.props.changeContent(this.props.Register)} block>Create account</Button>
					
					<p className="center">
						Already have an account? <u><a className="modalLink" onClick={() => this.props.changeContent(this.props.Login)}>Login</a></u>
					</p>
				</ModalBody>
			</div>
		);
	}
}

export default Register;