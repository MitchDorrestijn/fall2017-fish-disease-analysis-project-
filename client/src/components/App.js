import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import '../styles/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './navigation/NavigationBar';
import Homepage from './homepage/Homepage';
import MyAquarium from './myAquarium/MyAquarium';
import ModalBase from './modal/ModalBase';
import DataAccess from '../scripts/DataAccess';
import * as firebase from 'firebase';
import { reactTranslateChangeLanguage } from 'translate-components';

const config = {
	apiKey: "AIzaSyBxbF0vZXeq8ItH9SsQvO8Ynev_5-lGffs",
    authDomain: "fishproject-47cfd.firebaseapp.com",
    databaseURL: "https://fishproject-47cfd.firebaseio.com",
    projectId: "fishproject-47cfd",
    storageBucket: "fishproject-47cfd.appspot.com",
    messagingSenderId: "324776878982"
}

const app = firebase.initializeApp(config);
let da = new DataAccess ();

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showError: false,
			errorContent: "",
			modalContent: null
		}
	}




	userLogin = (email, password) => {
		//const user = {
		//	user: {
		//		email: "c.severein98@gmail.com",
		//		password: "abcdefg",
		//		firstName: "Coen",
		//		lastName: "Severein",
		//		country: "Belgium"
		//	}
		//}

		//da.postData (`/register`, user, (err, res) => {
		//	if (!err) {
		//		console.log(res);
		//	}
		//});
		app.auth().signInWithEmailAndPassword(email, password).then(() => {
			alert("Succesvol ingelogd. Redirect naar /myAquarium");
		}).catch((error) => {
			this.showError(true, error.message);
		});
	}

	userRegister = (email, password, firstName, lastName, country) => {
		const user = {
			user: {
				email: email,
				password: password,
				firstName: firstName,
				lastName: lastName,
				country: country
			}
		}

		da.postData (`/register`, user, (err, res) => {
			if (!err) {
				alert("Succesvol geregistreerd");
			}else{
				console.log(err);
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
	}

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
				<NavigationBar openModal={this.openModal}/>
				<div className="block-wrapper">
					<BrowserRouter>
						<Switch>
							<Route exact path="/" render={(props) => {
								return <Homepage {...props} openModal={this.openModal}/>
							}}/>
							<Route path="/myAquarium" component={MyAquarium}/>
						</Switch>
					</BrowserRouter>
				</div>
				<ModalBase
					errorContent={this.state.errorContent}
					isErrorVisible={this.state.showError}
					showError={this.showError}
					isVisible={this.state.showModal}
					userLogin={this.userLogin}
					userRegister={this.userRegister}
					openModal={this.openModal}
					closeModal={this.closeModal}
				>
					{this.state.modalContent}
				</ModalBase>
			</div>
		);
	}
}
