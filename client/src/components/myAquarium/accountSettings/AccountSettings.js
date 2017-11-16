import React from 'react';
import {Col, Input, InputGroup} from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import Setting from './Setting';
import SettingsBox from './SettingsBox';

export default class AccountSettings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			salutation: "Mr.",
			surname: "",
			birthDay: "",
			birthMonth: "",
			birthYear: "",
			email: "",
			password: "",
			confirmPassword: ""
		};
	}

	changeName = (evt) => {
		this.setState({
			name: evt.target.value
		});
	};

	changeSalutation = (evt) => {
		this.setState({
			salutation: evt.target.value
		});
	};

	changeSurname = (evt) => {
		this.setState({
			surname: evt.target.value
		});
	};

	changeBirthDay = (evt) => {
		if (evt.target.value > 0 && evt.target.value < 31) {
			this.setState({
				birthDay: evt.target.value,
			});
		}
	};

	changeBirthMonth = (evt) => {
		if (evt.target.value > 0 && evt.target.value < 13) {
			this.setState({
				birthMonth: evt.target.value,
			});
		}
	};

	changeBirthYear = (evt) => {
		if (evt.target.value > 1917 && evt.target.value < 2018) {
			this.setState({
				birthYear: evt.target.value,
			});
		}
	};

	changeEmail = (evt) => {
		this.setState({
			email: evt.target.value
		});
	};

	changePassword = (evt) => {
		this.setState({
			password: evt.target.value
		});
	};

	changeConfirmPassword = (evt) => {
		this.setState({
			confirmPassword: evt.target.value
		});
	};

	render() {
		return (
			<div className="account-settings">
				<h1 className="center">Account settings</h1>
				<Col lg={{size: 8, offset: 2}}>
					<SettingsBox title="User information">
						<Setting title="Name">
							<Input
								value={this.state.name}
								onChange={this.changeName}
							/>
						</Setting>
						<Setting title="Salutation">
							<Input
								type="select"
								className="custom-select"
								value={this.state.salutation}
								onChange={this.changeSalutation}
							>
								<option value="Mr.">Mr.</option>
								<option value="Mrs.">Mrs.</option>
							</Input>
						</Setting>
						<Setting title="Surname">
							<Input
								value={this.state.surname}
								onChange={this.changeSurname}
							/>
						</Setting>
						<Setting title="Date of birth">
							<InputGroup>
								<Input
									placeholder="dd"
									type="number"
									value={this.state.birthDay}
									onChange={this.changeBirthDay}
								/>
								<Input
									placeholder="mm"
									type="number"
									value={this.state.birthMonth}
									onChange={this.changeBirthMonth}
								/>
								<Input
									placeholder="yyyy"
									type="number"
									value={this.state.birthYear}
									onChange={this.changeBirthYear}
								/>
							</InputGroup>
						</Setting>
					</SettingsBox>
					<SettingsBox title="Login details">
						<Setting title="E-mail">
							<Input
								value={this.state.email}
								onChange={this.changeEmail}
							/>
						</Setting>
						<Setting title="Password">
							<Input
								type="password"
								value={this.state.password}
								onChange={this.changePassword}
							/>
						</Setting>
						<Setting/>
						<Setting title="Re-enter password">
							<Input
								type="password"
								value={this.state.confirmPassword}
								onChange={this.changeConfirmPassword}
							/>
						</Setting>
					</SettingsBox>
					<div className="text-right">
						<ActionButton buttonText="Save changes" color="primary btn-transperant"/>
					</div>
				</Col>
			</div>
		);
	}
}