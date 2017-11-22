import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import { Table } from 'reactstrap';


export default class TodaysData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//date needs to be orderd on order of table
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
