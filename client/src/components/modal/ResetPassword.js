import React from 'react';
import {
	ModalHeader,
	ModalBody,
	Button,
	FormGroup,
	Label,
	InputGroup,
	InputGroupAddon,
	Input,
	Alert
} from 'reactstrap';
import Error from './Error';
import Translate from 'translate-components';

class ResetPassword extends React.Component {
	resetPassword = () => {
		const password = document.getElementById("password").value;
		const repeatpassword = document.getElementById("repeatpassword").value;
		
		if(password && repeatpassword){
			if(password === repeatpassword){
				this.props.userResetPassword(password);
			}else{
				this.props.showError(true, "Password is not the same");
			}
		}else{
			this.props.showError(true, "Not all fields are filled in");
		}
	};
	
	render() {
		return (
			<div>
				<ModalHeader toggle={() => this.props.toggleModal()}>Reset password</ModalHeader>
				<ModalBody>
					<Alert color="secondary">
						Please fill in your new password
					</Alert>
					{ this.props.isErrorVisible ?
						<Error errorContent={this.props.errorContent} /> :
						null
					}
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
					<Button outline className="modalLink" color="secondary" onClick={() => this.resetPassword()} block>Reset password</Button>
				</ModalBody>
			</div>
		);
	}
}

export default ResetPassword;