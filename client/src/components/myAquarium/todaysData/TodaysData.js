import React from 'react';
import DataAccess from '../../../scripts/DataAccess';
import * as firebase from 'firebase';

export default class TodaysData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			error: null
		}
	}

	verifyLogin = (user) => {
		if (user) {
			firebase.auth().currentUser.getIdToken().then((result) => {
				console.log (result);
				let da = new DataAccess (result);
				da.getData ('/aquaria/3V3kij8a0XN6eW3GEfHF', (err, res) => {
					if (!err) {
						let result = [];
						delete res.aquarium.user;
						for (let elem in res.aquarium) {
							let entry = (
								<tr>
									<td>{elem}</td>
									<td>{res.aquarium[elem]}</td>
								</tr>
							);
							result.push (entry);
						}
						this.setState({
							data: result,
							error: null
						});
					}
				});
			});
		} else {
			this.setError("You are not logged in");
		}
	};

	setData = (data) => {
		this.setState({
			data: data,
			error: null
		});
	};

	setError = (error) => {
		this.setState ({
			data: null,
			error: error
		});
	};

	componentWillMount() {
		firebase.auth().onAuthStateChanged((user) => {
			this.verifyLogin(user);
		});
		let user = firebase.auth().currentUser;
		this.verifyLogin(user);
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