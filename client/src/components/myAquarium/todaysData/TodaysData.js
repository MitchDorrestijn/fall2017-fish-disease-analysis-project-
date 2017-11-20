import React from 'react';
import * as firebase from 'firebase';

export default class TodaysData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			error: null
		}
	}

	verifyLogin = () => {
		if (user) {
			this.setData(user.displayName);
		} else {
			this.setError("You are not logged in");
		}
	};

	setData = (data) => {
		this.setState({
			data: user.displayName,
			error: null
		});
	};

	setError = (error) => {
		this.setState ({
			data: null,
			error: "You are not logged in"
		});
	};

	componentWillMount() {
		firebase.auth().onAuthStateChanged((user) => {
			this.verifyLogin(user);
		});
		this.verifyLogin();
	}

	render() {
		return (
			<div>
				<h1>
					{this.state.data}
				</h1>
				<p>
					{this.state.error}
				</p>
			</div>
		);
	}
}