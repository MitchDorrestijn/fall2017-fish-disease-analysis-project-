import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import { Table } from 'reactstrap';
import {Link} from 'react-router-dom';
import AddTodaysData from '../../modal/AddTodaysData';
import AddAquarium from '../../modal/AddAquarium';
import DataAccess from '../../../scripts/DataAccess';

export default class TodaysData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			aquariumData: [{}],
			createdAquariums: [],
			currentAquarium: null
		};
		this.tableHeaders = ["date", "phosphate", "nitrate", "nitrite", "iron", "gH", "temperature", "oxygen", "carbon", "dioxide", "kH", "chlorine"];
	};
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
	showAddTodaysData = (e) => {
		e.preventDefault ();
		this.props.openModal(AddTodaysData);
	};
	showAddAquariumModel = (e) => {
		e.preventDefault ();
		this.props.openModal(AddAquarium);
	}
	componentWillMount() {
		this.initSetters();
	};
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
					if (!err) {
					} else {
				};
			});
	};
	fillAquariumTable = (object) => {
		let rows = [];
		this.tableHeaders.forEach((value, index) => {
			Object.keys(object).forEach( (key) => {
				if (key === value) {
					rows.push(<td key={index}>{object[key]}</td>);
				};
				if (index > rows.length) {
					rows.push(<td key={index}>NA</td>);
				};
			});
		});
		if (rows.length === 11){
			rows.push(<td key={12}>NA</td>);
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
	drawAquariumTable = (aquariumData) => {
		return(
			<div className="table_card">
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
				<Card>
					<CardBody>
						<h4>Aquarium data from: {this.state.currentAquarium}</h4>
						<Table responsive>
							{this.drawAquariumTable(this.state.aquariumData)}
						</Table>
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
							<a href="" onClick={this.showAddTodaysData}>+ Add today's data</a>
						</div>
					</Col>
				</Row>
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
