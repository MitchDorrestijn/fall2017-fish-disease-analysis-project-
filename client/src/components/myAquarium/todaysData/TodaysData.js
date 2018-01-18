import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import { Table } from 'reactstrap';
import AddTodaysData from '../../modal/AddTodaysData';
import AddAquarium from '../../modal/AddAquarium';
import DataAccess from '../../../scripts/DataAccess';

export default class TodaysData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			aquariumData: [{}],
			createdAquariums: [],
			currentAquarium: null,
			currentAquariumID: null
		};
		this.keyCounter  = 0;
		this.tableHeaders = ["Date", "Phosphate", "Nitrate", "Nitrite", "Iron", "gH", "Temperature", "Oxygen", "Carbon", "Dioxide", "kH", "Chlorine"];
	};
	//setState functions:
	setAquariumData = (data) => {
		this.setState({
			aquariumData: data
		});
	};
	setCreatedAquariums = (aquariums) => {
		this.setState({
			createdAquariums: aquariums
		});
	};
	setCurrentAquarium = (aquarium) => {
		this.setState({
			currentAquarium: aquarium
		})
	};
	setCurrentAquariumID = (aquarium) => {
		this.setState({
			currentAquariumID: aquarium
		})
	};
	//modals functions:
	showAddTodaysData = (e) => {
		e.preventDefault ();
		this.props.openModal(AddTodaysData, {
			refreshPage: () => this.getAquariumData(this.state.currentAquariumID, this.state.currentAquarium),
			aquariumId: this.state.currentAquariumID,
			aquariumName: this.state.currentAquarium
		});
	};
	showAddAquariumModel = (e) => {
		e.preventDefault ();
		this.props.openModal(AddAquarium, {refreshPage: this.initSetters});
	}
	//component mount/unmount functions:
	componentWillMount() {
		this.initSetters();
	};
	//get/post data functions:
	initSetters = () => {
		let da = new DataAccess ();
		da.getData ('/aquaria', (err, res) => {
			this.setCreatedAquariums(res.message);
			if (!err) {
			} else {
			};
		});
	};
	getAquariumData = (currentAquariumID, currentAquariumName) => {
				let da = new DataAccess ();
				da.getData (`/aquaria/${currentAquariumID}/entries`, (err, res) => {
					if (res.message.entries === undefined) {
						this.setAquariumData([{}]);
					} else {
						this.setAquariumData(res.message.entries);
					}
					this.setCurrentAquarium(currentAquariumName);
					this.setCurrentAquariumID(currentAquariumID);
					if (!err) {
					} else {
				};
			});
	};
	//checks if aquarium is selected. If not it returns a <p> tag.
	checkIfAquariumSelected = () => {
		if (this.state.currentAquarium === null) {
			return (<p>Please select an aquarium.</p>);
		};
		return null;
	};
	//fill table functions:
	fillAquariumTable = (object) => {
		let rows = [];
		this.tableHeaders.forEach((value, index) => {
			Object.keys(object).forEach( (key) => {
				this.keyCounter ++;
				if (key === value) {
					rows.push(<td key={this.keyCounter}>{object[key]}</td>);
				};
				if (index > rows.length) {
					rows.push(<td key={this.keyCounter}>N/A</td>);
				};
			});
		});
		if (rows.length === 11){
			rows.push(<td key={this.keyCounter}>N/A</td>);
		}
		return rows;
	};
	fillAquariumTableHeader = () => {
		let rows = [];
		this.tableHeaders.forEach((value, index) => {
			rows.push(<th key={index}>{value}</th>);
		})
		return rows;
	}
	//create table functions:
	drawAquariumTable = (aquariumData) => {
		return(
			<div className="table_card">
				<Table responsive>
					<thead>
						<tr>
							{this.fillAquariumTableHeader()}
						</tr>
					</thead>
					<tbody>
						{
							aquariumData.map( (value, index) => {
								return(
									<tr key={index}>
										{this.fillAquariumTable(value)}
									</tr>
								)
							})
						}
					</tbody>
				</Table>
			</div>
		);
	};
	drawAquariumButtons = (createdAquariums) => {
		return(
			<div className="text-center">
				{
					createdAquariums.map( (createdAquarium) => {
						return <ActionButton	key={createdAquarium.id} buttonText={createdAquarium.name} color="primary btn-transperant"
																	onClickAction={(arr) => this.getAquariumData(createdAquarium.id, createdAquarium.name)}/>
					})
				}
			</div>
		);
	};
	drawAquariumCard = () => {
		let object = [];
		if (this.state.currentAquarium !== null && this.state.currentAquarium !== undefined ) {
			object.push(
				<Card key={this.keyCounter}>
					<CardBody>
						<h4>Aquarium data from: {this.state.currentAquarium}</h4>
						{this.drawAquariumTable(this.state.aquariumData)}
						<a href="" onClick={this.showAddTodaysData}>+ Add today's data</a>
					</CardBody>
				</Card>
			)
		};
		return (object);
	};

	render() {
		return (
			<div>
				<h1>Today's Data</h1>
				<Row>
					<Col>
						<div className="addBtns">
							{this.drawAquariumButtons(this.state.createdAquariums)}
							<a href="" onClick={this.showAddAquariumModel}>+ Add aquarium</a>
						</div>
					</Col>
				</Row>
				{this.checkIfAquariumSelected()}
				<Row>
					<Col>
						<div className="container">
							<div className="row inner-content">
								<div className="col-md-12 no-gutter">
									{this.drawAquariumCard()}
								</div>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}
