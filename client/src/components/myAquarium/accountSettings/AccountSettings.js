import React from 'react';
import {Col, Input, InputGroup} from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import Setting from './Setting';
import SettingsBox from './SettingsBox';
import UserService from '../../../provider/user-data-service';
import Error from '../../modal/Error';
import * as firebase from 'firebase';
import CountrySelect from '../../modal/CountrySelect';

//TODO: refactor country select to controlled component
export default class AccountSettings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			country: '',
			surname: '',
			birthDay: '1',
			birthMonth: '1',
			birthYear: '2017',
			password: '',
			confirmPassword: '',
			loginErrorVisible: false,
			accountErrorVisible: false,
			errorLoginContent: '',
			errorAccountContent: '',
		};
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			this.verifyLogin(user);
		});
		let user = firebase.auth().currentUser;
		this.verifyLogin(user);
	}

	verifyLogin = (user) => {
		if (user) {
			let userService = new UserService();
			userService.getUserData(user, (err, res) => {
				if (!err) {
					let birthDayList;
					//If data of user is not set, put in default date
					if (res.message.birthDate) {
						birthDayList = this.formatDate(res.message.birthDate);
					} else {
						birthDayList = this.formatDate(
							'1999-01-01T00:00:00.000Z');
					}
					this.updateInfo({
						name: res.message.firstName,
						surname: res.message.lastName,
						email: res.message.email,
						country: res.message.country,
						birthDay: birthDayList.birthDay,
						birthMonth: birthDayList.birthMonth,
						birthYear: birthDayList.birthYear,
					});
					this.cleanErrors();
				}
			});
		}
	};

	/**
	 * @param date String
	 * @return Object with birthDay,birthMonth and birthYear
	 **/
	formatDate = (date) => {
		const birthDayList = date.split('-', 3);
		const birthYear = birthDayList[0];
		const birthMonth = birthDayList[1];
		const birthDay = birthDayList[2].slice(0, 2);
		const birthDate = {
			birthDay: birthDay,
			birthMonth: birthMonth,
			birthYear: birthYear,
		};
		return birthDate;
	};

	submit = () => {
		//Javascript iso object
		const birthDate = new Date(
			`${this.state.birthYear}-${this.state.birthMonth}-${this.state.birthDay}`);
		const profile = {
			firstName: this.state.name,
			country: this.state.country,
			lastName: this.state.surname,
			email: this.state.email,
			birthDate: birthDate,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword,
		};
		let user = firebase.auth().currentUser;
		let userService = new UserService();
		if (this.verifyInput(profile)) {
			userService.updateUserData(user.uid, profile, (err, res) => {
				if (!err) {
					alert('Account has been updated');
				} else {
					this.showError('login', true, err.message);
				}
			});
		}
	};

	/**
	 * If profile is valid return true, set ui errors
	 * @param profile object
	 * @return boolean
	 **/
	verifyInput = (profile) => {
		if (!profile.firstName || !profile.lastName || !profile.birthDate) {
			this.showError('account', true, 'Please fill in all fields');
			return false;
		}
		if (!profile.firstName || !profile.lastName || !profile.birthDate) {
			this.showError('login', true, 'Please fill in all fields');
			return false;
		}
		if (profile.password === profile.confirmPassword) {
			this.cleanErrors();
			return true;
		} else {
			this.showError('login', true, 'Password is not the same');
			return false;
		}
	};

	updateInfo = (data) => {
		this.setState(data);
	};

	showError = (section, show, content) => {
		if (section === 'login') {
			this.setState({
				loginErrorVisible: show,
				errorLoginContent: content,
			});
		} else if (section === 'account') {
			this.setState({
				accountErrorVisible: show,
				errorAccountContent: content,
			});
		}
	};

	cleanErrors = () => {
		this.showError('account', false);
		this.showError('login', false);
	};

	changeName = (evt) => {
		this.setState({
			name: evt.target.value,
		});
	};

	changeCountry = (evt) => {
		this.setState({
			country: evt.target.value,
		});
	};

	changeSurname = (evt) => {
		this.setState({
			surname: evt.target.value,
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
			email: evt.target.value,
		});
	};

	changePassword = (evt) => {
		this.setState({
			password: evt.target.value,
		});
	};

	changeConfirmPassword = (evt) => {
		this.setState({
			confirmPassword: evt.target.value,
		});
	};

	render() {
		return (
			<div className="account-settings">
				<h1 className="center">Account settings</h1>
				<Col md={{size: 12}} lg={{size: 8, offset: 2}}>
					<SettingsBox title="User information">
						<Col xs="12" md="12">
							{this.state.accountErrorVisible ?
								<Error
									errorContent={this.state.errorAccountContent}/> :
								null
							}
						</Col>
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
							<CountrySelect classStyle='custom-select'
							               country={this.state.country}
							               function={this.changeCountry}/>
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
						<Col xs="12" md="12">
							{this.state.loginErrorVisible ?
								<Error
									errorContent={this.state.errorLoginContent}/> :
								null
							}
						</Col>
						<Col xs="12" md="12">
							{!this.state.loginErrorVisible ?
								<div className="pass-alert">
									If you don't want to change your password,
									leave the password fields empty
								</div> : null
							}
						</Col>
						<Setting title="E-mail">
							<Input
								disabled
								value={this.state.email}
								onChange={this.changeEmail}
							/>
						</Setting>
						<Setting title="New password">
							<Input
								type="password"
								value={this.state.password}
								onChange={this.changePassword}
								placeholder='********'
							/>
						</Setting>
						<Setting/>
						<Setting title="Re-enter new password">
							<Input
								type="password"
								value={this.state.confirmPassword}
								onChange={this.changeConfirmPassword}
								placeholder='********'
							/>
						</Setting>
					</SettingsBox>
					<div className="text-right">
						{/*TODO: Not able to give event to the actionbutton, not sure if this is intended*/}
						<ActionButton buttonText="Save changes" onClickAction={this.submit} color="primary btn-transperant"/>
					</div>
				</Col>
			</div>
		);
	}
}