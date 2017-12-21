import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import '../styles/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import NavigationBar from './navigation/NavigationBar';
import Feedback from './feedback/Feedback';
import Homepage from './homepage/Homepage';
import MyAquarium from './myAquarium/MyAquarium';
import ModalBase from './modal/ModalBase';
import Login from './modal/Login';
import Search from './search/Search';
import DataAccess from '../scripts/DataAccess';
import ChatInitializer from './chat/ChatInitializer';
import Admin from '../admin/Admin';
import * as firebase from 'firebase';
import '@firebase/firestore';
import { reactTranslateChangeLanguage } from 'translate-components';
import AdminError from '../admin/components/AdminError';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			showModal: false,
			showError: false,
			errorContent: "",
			modalContent: null,
			modalCustomProps: null,
			redirect: null,
			loggedIn: false,
			isAdmin: false,
			showFeedback: false,
			feedbackContent: "",
			feedbackColor: ""
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
			this.updateLoggedIn();
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

		let da = new DataAccess (true);
		da.postData(`/register`, user, (err, res) => {
			if (!err) {
				this.closeModal();
				this.setState ({
					redirect: <Route render={() => {
						this.setState ({redirect: null});
						return <Redirect to=""/>
					}}/>
				});
				this.showFeedback("success", "U bent succesvol geregistreerd! Er is een bevestigingsmail gestuurd naar het opgegeven emailadres.");
			} else {
				console.log(err);
				this.showError(true, err.message);
			}
		});
	};

	userForgotPassword = (email) => {
		const emailObj = {
			email: email
		};

		let da = new DataAccess (true);
		da.postData(`/forgot-password`, emailObj, (err, res) => {
			if (!err) {
				this.closeModal();
				this.setState ({
					redirect: <Route render={() => {
						this.setState ({redirect: null});
						return <Redirect to=""/>
					}}/>
				});
			} else {
				this.showError(true, err.message);
			}
		});
	};

	userResetPassword = (password) => {
		const passwordObj = {
			password: password
		};
		const token = window.location.pathname.replace("/forgot-password/", "");

		let da = new DataAccess (true);
		da.postData(`/forgot-password/` + token, passwordObj, (err, res) => {
			if (!err) {
				this.openModal(Login);
			} else {
				this.showError(true, err.message);
			}
		});
	};

	openModal = (content, props) => {
		this.setState ({
			showModal: true,
			modalContent: content,
			modalCustomProps: props
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
	};

	componentDidMount() {
		this.getLanguage();
		this.setNotifications();
	}

	componentWillMount() {
		this.updateLoggedIn();
	}

	setNotifications = () => {
		const messaging = firebase.messaging();
		const Auth = firebase.auth();
		messaging.requestPermission()
		.then(function() {
			console.log('Notification permission granted.');
			getToken()
		})
		.catch(function(err) {
			console.log('Unable to get permission to notify.', err);
		});
		messaging.onTokenRefresh(() => {
			getToken();
		});
		messaging.onMessage((payload) => {
			console.log("Message: " + payload);
		});
		const getToken = () => {
			// Get token and send to server
			messaging.getToken()
			.then(function(currentToken) {
				if (currentToken) {
					console.log(currentToken);
					firebase.firestore()
					.collection("users")
					.doc(Auth.currentUser.uid)
					.collection("devices")
					.doc(currentToken)
					.set({
						device: "Browser",
						id: currentToken
					})
					//db.coll
				} else {
					console.log('No Instance ID token available. Request permission to generate one.');
				}
			})
			.catch(function(err) {
				console.log('An error occurred while retrieving token. ', err);
			});
		}
	};

	updateLoggedIn = () => {
		firebase.auth().onAuthStateChanged((user) => {
			let da = new DataAccess();
			if (user) {
				da.getData('/users/' + user.uid, (err, res) => {
					if (res.message.isAdmin) {
						this.setState({
							loggedIn: true,
							isAdmin: true,
							show: true
						});
					} else {
						this.setState({
							loggedIn: true,
							isAdmin: false,
							show: true
						});
					}
				});
			}else{
				this.setState({
					loggedIn: false,
					isAdmin: false,
					show: true
				});
			}
		});
	};

	logOut = () => {
		firebase.auth().signOut().then(() => {
			this.setState ({
				redirect: <Route render={() => {
					this.setState ({redirect: null});
					return <Redirect to=""/>
				}}/>
			});
		}, function(error) {
			console.log("Something went wrong: " + error);
		});
	};
	
	closeFeedback = () => {
		this.setState({
			showFeedback: false
		});
	};
	
	showFeedback = (color, message) => {
		this.setState({
			showFeedback: true,
			feedbackContent: message,
			feedbackColor: color
		});
	};

	render() {
		if (this.state.show) {
			return (
				<div className="App">
					<BrowserRouter>
						<div>
							<div className="block-wrapper">
								<Switch>
									{this.state.redirect}
									<Route path="/admin" render={(props) => {
										const {loggedIn, isAdmin} = this.state;
										if (loggedIn && isAdmin) {
											return <Admin {...props} openModal={this.openModal}/>;
										} else {
											return <AdminError/>
										}
									}}/>
									<Route path="/" render={(props) => {
										return (
											<div className="body-margin-top">
												<NavigationBar
													loggedIn={this.state.loggedIn}
													isAdmin={this.state.isAdmin}
													logOut={this.logOut}
													openModal={this.openModal}/>
												{ this.state.showFeedback ?
													<Feedback feedbackColor={this.state.feedbackColor} feedbackContent={this.state.feedbackContent} closeFeedback={this.closeFeedback} showFeedback={this.state.showFeedback} /> :
													null
												}
												<Switch>
													<Route exact path="/" render={(props) => {
														return <Homepage {...props} openModal={this.openModal}/>
													}}/>
													<Route exact path="/chat" render={(props) => {
														return <ChatInitializer {...props} loggedIn={this.state.loggedIn} isAdmin={this.state.isAdmin}/>
													}}/>
													<Route exact path="/chat/:userId" render={(props) => {
														return <ChatInitializer {...props} loggedIn={this.state.loggedIn} isAdmin={this.state.isAdmin}/>
													}}/>
													<Route path="/myAquarium" render={(props) => {
														return <MyAquarium {...props} openModal={this.openModal} app={this.app}/>
													}}/>
													<Route path="/forgot-password" render={(props) => {
														return <Homepage {...props} openModal={this.openModal} resetPassword={true}/>
													}}/>
													<Route path="/search" component={Search}/>
												</Switch>
											</div>
										);
									}}/>
								</Switch>
							</div>
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
								customProps={this.state.modalCustomProps}
							>
								{this.state.modalContent}
							</ModalBase>
						</div>
					</BrowserRouter>
				</div>
			);
		} else {
			return null;
		}
	}
}
