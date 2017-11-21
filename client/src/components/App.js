import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import '../styles/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './navigation/NavigationBar';
import Homepage from './homepage/Homepage';
import MyAquarium from './myAquarium/MyAquarium';
import ModalBase from './modal/ModalBase';
import DataAccess from '../scripts/DataAccess';
import * as firebase from 'firebase';
import { reactTranslateChangeLanguage } from 'translate-components';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showError: false,
			errorContent: "",
			modalContent: null,
			redirect: null
		};
		this.config = {
			apiKey: "AIzaSyBxbF0vZXeq8ItH9SsQvO8Ynev_5-lGffs",
			authDomain: "fishproject-47cfd.firebaseapp.com",
			databaseURL: "https://fishproject-47cfd.firebaseio.com",
			projectId: "fishproject-47cfd",
			storageBucket: "fishproject-47cfd.appspot.com",
			messagingSenderId: "324776878982"
		};
		this.app = firebase.initializeApp(this.config);
	}

	userLogin = (email, password) => {
		this.app.auth().signInWithEmailAndPassword(email, password).then(() => {
			this.closeModal();
			this.setState ({
				redirect: <Route render={() => {
					this.setState ({redirect: null});
					return <Redirect to="/myAquarium"/>
				}}/>
			});
		}).catch((error) => {
			this.showError(true, error.message);
		});
	};
	
	userRegister = (email, password, firstName, lastName, country) => {
		const user = {
			user: {
				email: email,
				password: password,
				firstName: firstName,
				lastName: lastName,
				country: country
			}
		};

		let da = new DataAccess ();
		da.postData(`/register`, user, (err, res) => {
			if (!err) {
				alert("Succesvol geregistreerd");
			} else {
				this.showError(true, err.message);
			}
		});
	};
	
	userForgotPassword = (email) => {
		const emailObj = {
			email: email
		};

		let da = new DataAccess ();
		da.postData(`/forgot-password`, emailObj, (err, res) => {
			if (!err) {
				alert("Succesvol aangevraagd");
			} else {
				this.showError(true, err.message);
			}
		});
	}
	
	userResetPassword = (password) => {		
		const passwordObj = {
			password: password
		};
		const token = window.location.pathname.replace("/forgot-password/", "");

		let da = new DataAccess ();
		da.postData(`/forgot-password/` + token, passwordObj, (err, res) => {
			if (!err) {
				alert("Succesvol Gereset");
			} else {
				this.showError(true, err.message);
			}
		});
	}

	openModal = (content) => {
		this.setState ({
			showModal: true,
			modalContent: content
		});

		this.showError(false, "");
	};

	showError = (show, content) => {
		this.setState ({
			showError: show,
			errorContent: content
		});
	};

	closeModal = () => {
		this.setState ({
			showModal: false
		});
	};

	getLanguage = () => {
		const currentLanguage = localStorage.getItem('language');
		reactTranslateChangeLanguage (currentLanguage);
		console.log (currentLanguage);
	}

	componentDidMount() {
		this.getLanguage();
	}

	render() {
		return (
			<div className="App">
				<BrowserRouter>
					<div>
						<NavigationBar openModal={this.openModal}/>
						<div className="block-wrapper">
							<Switch>
								{this.state.redirect}
								<Route exact path="/" render={(props) => {
									return <Homepage {...props} openModal={this.openModal}/>
								}}/>
								<Route path="/myAquarium" component={MyAquarium}/>
								<Route path="/forgot-password" render={(props) => {
									return <Homepage {...props} openModal={this.openModal} resetPassword={true}/>
								}}/>
							</Switch>
						</div>
					</div>
				</BrowserRouter>
				<ModalBase
					errorContent={this.state.errorContent}
					isErrorVisible={this.state.showError}
					showError={this.showError}
					isVisible={this.state.showModal}
					userLogin={this.userLogin}
					userRegister={this.userRegister}
					userForgotPassword={this.userForgotPassword}
					userResetPassword={this.userResetPassword}
					openModal={this.openModal}
					closeModal={this.closeModal}
				>
					{this.state.modalContent}
				</ModalBase>
			</div>
		);
	}
}
