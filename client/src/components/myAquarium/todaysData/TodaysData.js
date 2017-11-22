import React from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button, Col, Row } from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import { Table } from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';
import * as firebase from 'firebase';

export default class TodaysData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//date needs to be orderd on order of table
			data: null,
			error: null
			aquariumData: [
				[
					["22-10-19", 1, 0.1, 7, 4],
					["24-10-19", 6, 0.4, 5, 4],
					["27-10-19", 3.4, 0.3, 5, 4]
				],
				[
					["22-10-19", 1, 0.1, 7, 4],
					["24-10-19", 2, 0.4, 5, 4],
					["27-10-19", 3.4, 0.3, 5, 4]
				],
				[
					["22-10-19", 1, 0.1, 7, 4],
					["24-10-19", 4, 0.4, 5, 4],
					["27-10-19", 3.4, 0.3, 5, 4]
				]
			],
			currentAquarium: [
				["22-10-19", 1, 0.1, 7, 4],
				["24-10-19", 6, 0.4, 5, 5],
				["27-10-19", 3.4, 0.3, 5, 4]
			],
			aquariumNames: ["Aquarium 1", "Aquarium 2", "Aquarium 3"]
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
					} else {
						this.setState({
							data: null,
							error: err
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

	updateCurrentAquarium(aquariumData){
		this.setState({currentAquarium: aquariumData});
	}


	drawAquariumTable(aquariumData){
		return(
			<div className="table_card">
				<thead>
					<tr>
						<th>Date</th>
						<th>Phosphate</th>
						<th>Nitrate</th>
						<th>Nitrite</th>
						<th>Iron</th>
						<th>gH</th>
						<th>Temperature</th>
						<th>Oxygen</th>
						<th>Carbon</th>
						<th>Dioxide</th>
						<th>kH</th>
						<th>Chlorine</th>
					</tr>
				</thead>
				<tbody>
					{
						aquariumData.map(function(value, index){
							return(
								<tr key={value}>
									{
										value.map(function(value, index){
											return(<td key={value}>{value}</td>)
										})
									}
								</tr>
							)
						})
					}
				</tbody>
			</div>
		)
	}

	drawAquariumButtons = (aquariumNames) => {
		return(
			<div className="text-center">
				{
					aquariumNames.map(function(aquariumName){
						return <ActionButton key={aquariumName} buttonText={aquariumName} color="primary btn-transperant"/>
					})
				}
			</div>
		)
	}


	render() {
		return (
			<div>
				<h1>Today's Data</h1>
				<Row>
					<Col>
						{this.drawAquariumButtons(this.state.aquariumNames)}
					</Col>
				</Row>
				<Row>
					<Col>
						<div className="container">
								<div className="row inner-content">
									<div className="col-md-12 no-gutter">
									<Card>
										<CardBody>
											<Table responsive>
												{this.drawAquariumTable(this.state.currentAquarium)}
											</Table>
										</CardBody>
									</Card>
								</div>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}