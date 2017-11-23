import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import { Table } from 'reactstrap';
import {Link} from 'react-router-dom';
import AddTodaysData from '../../modal/AddTodaysData';

const todaysData = [{
	inAquarium:"aquarium1",
	dataList: [{
		date: "22-05-2017",
		phosphate: 1,
		nitrate: 1,
		nitrite: 6,
		iron: 1.6,
		gH: 11,
		temperature: 74,
		oxygen: 0.3,
		carbon: 2,
		dioxide: 9,
		kH: 22,
		chlorine: 10
	}, {
		date: "24-05-2017",
		phosphate: 1,
		nitrite: 6,
		iron: 1.6,
		kH: 22,
		gH: 11,
		temperature: 74,
		// oxygen: 0.3,
		// carbon: 2,
		dioxide: 9,
		nitrate: 1,
		chlorine: 150
	}]
}, {
	inAquarium:"aquarium2",
	dataList: [{
		date: "22-05-2017",
		phosphate: 2,
		nitrate: 1,
		nitrite: 6,
		iron: 1.6,
		gH: 11,
		temperature: 74,
		oxygen: 0.3,
		carbon: 2,
		dioxide: 9,
		kH: 22,
		chlorine: 10
	}]
}, {
	inAquarium:"aquarium3",
	dataList: [{
		date: "22-05-2017",
		phosphate: 3,
		nitrate: 1,
		nitrite: 6,
		iron: 1.6,
		gH: 11,
		temperature: 74,
		oxygen: 0.3,
		carbon: 2,
		dioxide: 9,
		kH: 22,
		chlorine: 10
	}]
}];


export default class TodaysData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			aquariumData: [{
				inAquarium: null,
				dataList: [{
				}]
			}],
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
	setCurrentAquariums = (aquiriums) => {
		this.setState({
			createdAquariums: aquiriums
		});
	};
	showSelectedCategory = (button) => {
		this.setState({
			currentAquarium: button
		});
	};
	showAddTodaysData = (e) => {
		e.preventDefault ();
		this.props.openModal(AddTodaysData);
	};
	createFilterButtons = () => {
		let buttons = this.state.createdAquariums.map((button, index) => {
			return (
				<ActionButton key={index} color="primary btn-transparent" buttonText={button} onClickAction={(arr) => this.showSelectedCategory(button)} />
			);
		});
		return (
			<div>
				{buttons}
			</div>
		);
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
		return rows;
	}
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
						aquariumData.dataList.map( (value, index) => {
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
					createdAquariums.map(function(createdAquariums){
						return <ActionButton key={createdAquariums} buttonText={createdAquariums} color="primary btn-transperant"/>
					})
				}
			</div>
		);
	};
	drawAquariumCard = () => {
		let object = [];
		if (this.state.currentAquarium !== null) {
			object.push(
				<Card>
					<CardBody>
						<Table responsive>
							{
								this.state.aquariumData.map( (value, index) => {
									if (value.inAquarium === this.state.currentAquarium) {
										return (this.drawAquariumTable(value))
									}
								})
							}
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
							{this.createFilterButtons()}
							<Link to="/">+ Add aquarium</Link>
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