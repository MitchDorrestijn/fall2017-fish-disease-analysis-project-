import React from 'react';
import {Col, Input, InputGroup} from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import Setting from './Setting';
import SettingsBox from './SettingsBox';
import UserService from '../../../provider/user-data-service';

export default class AccountSettings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			country: "The Netherlands",
			surname: "",
			birthDay: "",
			birthMonth: "",
			birthYear: "",
			email: "",
			password: "",
			confirmPassword: ""
		};
	}

	componentDidMount(){
		let userService = new UserService();
		const user = {
			id: 'z47rzcf3RyfRjNoJRk7yCkdO1hm1'
		};
		userService.getUserData(user,(err,res) => {
			this.updateInfo({
				name: res.firstName,
				surname: res.lastName,
				email: res.email,
				country: res.country
			})
		});
	}

	submit = (evt) => {
		// evt.preventDefault();
		//TODO: maybe export date conversion to new file
		const birthDate = new Date(this.state.birthYear,this.state.birthMonth,this.state.birthDay);
		console.log(birthDate);
		const profile = {
			name: this.state.name,
			country: this.state.country,
			surname: this.state.surname,
			email: this.state.email,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword
		}
	};

	updateInfo = (data) => {
		this.setState(data);
	};

	changeName = (evt) => {
		this.setState({
			name: evt.target.value
		});
	};

	changeCountry = (evt) => {
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
						<Setting title="Country">
							<Input
								type="select"
								className="custom-select"
								value={this.state.country}
								onChange={this.changeCountry}
							>
								<option>Netherlands</option>
								<option>London</option>
								<option>Test</option>
								<option>England</option>
								<option>Amsterdam</option>
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
						<ActionButton buttonText="Save changes" onClickAction={this.submit} color="primary btn-transperant"/>
					</div>
				</Col>
			</div>
		);
	}
}