import React from 'react';
import {Col, Input, InputGroup, Button} from 'reactstrap';
// import ActionButton from '../../base/ActionButton';
import Setting from './Setting';
import SettingsBox from './SettingsBox';
import UserService from '../../../provider/user-data-service';
import Error from '../../modal/Error'
import * as firebase from 'firebase';
import CountrySelect from '../../modal/CountrySelect';

export default class AccountSettings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			country: "The Netherlands",
			surname: "",
			birthDay: "2",
			birthMonth: "2",
			birthYear: "2017",
			email: "",
			password: "",
			confirmPassword: "",
			isErrorVisible: false,
			errorContent: ""
		};
	}

	componentDidMount(){
		firebase.auth().onAuthStateChanged((user) => {
			this.verifyLogin(user);
		});
		let user = firebase.auth().currentUser;
		this.verifyLogin(user);

	}

	verifyLogin = (user) => {
		if (user) {
			firebase.auth().currentUser.getIdToken().then((token) => {
				let userService = new UserService(token);
				userService.getUserData(user,(err,res) => {
					this.updateInfo({
						name: res.message.firstName,
						surname: res.message.lastName,
						email: res.message.email,
						country: res.message.country
					})
				});
				this.showError(false,"");
			});
		} else {
			this.showError(true,"You are not logged in");
		}
	};

	submit = (evt) => {
		evt.preventDefault();
		//TODO: maybe export date conversion function so it can be reused -1

		const birthDate = new Date(`${this.state.birthYear}/${this.state.birthMonth}/${this.state.birthDay}`);
		const profile = {
			firstName: this.state.name,
			country: this.state.country,
			lastName: this.state.surname,
			email: this.state.email,
			birthDate: birthDate,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword
		};
		let user = firebase.auth().currentUser;
		firebase.auth().currentUser.getIdToken().then((token) => {
			let userService = new UserService(token);
			if (this.verifyInput(profile)) {
				userService.updateUserData(user.uid,
					profile, (err, res) => {
						if (!err) {
							//TODO: alert is not pretty
							alert('Account has been updated');
						} else {
							console.log(err);
							alert('Something went wrong: ' + err);
						}
					});
			} else {
				alert('Not all values have been entered correctly');
			};
		});
	};

	// Stole this from modal/login
	verifyInput = (profile) => {
		if(profile.password === profile.confirmPassword){
			if(profile.email){
				this.showError(false, "");
				return true;
			} else {
				this.showError(true, "Not all fields are filled in");
			}
		} else {
			this.showError(true, "Password is not the same");
		}
	};

	updateInfo = (data) => {
		this.setState(data);
	};

	showError = (show, content) => {
		this.setState ({
			isErrorVisible: show,
			errorContent: content
		});
	};

	changeName = (evt) => {
		this.setState({
			name: evt.target.value
		});
	};

	changeCountry = (evt) => {
		this.setState({
			country: evt.target.value
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
							{/*<Input*/}
								{/*type="select"*/}
								{/*className="custom-select"*/}
								{/*value={this.state.country}*/}
								{/*onChange={this.changeCountry}*/}
							{/*>*/}
								<CountrySelect/>
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
					<div className="center">
						{ this.state.isErrorVisible ?
							<Error errorContent={this.state.errorContent} /> :
							null
						}
					</div>
					<div className="text-right">
						<Button onClick={this.submit}>submit</Button>
						{/*TODO: didn't get this working with the Actionbutton, change when example is provided*/}
						{/*<ActionButton buttonText="Save changes" onClickAction={this.submit} color="primary btn-transperant"/>*/}
					</div>
				</Col>
			</div>
		);
	}
}