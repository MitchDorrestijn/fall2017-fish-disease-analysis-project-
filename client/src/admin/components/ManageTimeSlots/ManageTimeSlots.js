import React, {Component} from 'react';
import {Table, Th, Tr, Td, Thead, Tbody} from 'react-super-responsive-table';
import {Button, ButtonGroup} from 'reactstrap';
import ActionButton from '../../../components/base/ActionButton';
import DataAccess from '../../../scripts/DataAccess';
import RemoveTimeSlot from './RemoveTimeSlot';
import ChangeTimeSlot from './ChangeTimeSlot';
import AddTimeSlot from './AddTimeSlot';
import addFishDesiseAdmin from '../../../components/modal/AddFishDiseaseAdmin';

export default class ManageTimeSlot extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableEntries: []
		};
	}

	parseDate = (date) => {
		let parsedDate = new Date (date);
		return parsedDate.toDateString();
	};

	parseTime = (date) => {
		let parsedDate = new Date (date);
		let hours = parsedDate.getHours();
		let minutes = parsedDate.getMinutes();
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		return `${hours}:${minutes}`;
	};

	componentWillMount() {
		this.getTimeslots();
	}

	cancelTimeSlot = (entry) => {
		this.props.openModal(RemoveTimeSlot, {
			refreshPage: this.getTimeslots,
			entry: entry
		});
	};

	changeTimeSlot = (entry) => {
		this.props.openModal(ChangeTimeSlot, {
			refreshPage: this.getTimeslots,
			entry: entry
		});
	};

	getTimeslots = () => {

		// Hier moeten afspraken worden opgehaald en in "results" worden gezet
		// Bij de onClickAction moet het id van de afspraak worden meegegeven
		let results = [];

		let da = new DataAccess();

		da.getData('/timeslots', (err, res) => {
			if (!err) {
				let resultsFromDB = res.message;
				console.log (resultsFromDB);
				for (let i = 0; i < resultsFromDB.length; i++) {
					if (resultsFromDB[i].canceled) {
						resultsFromDB.splice(i, 1);
						i--;
					}
				}
				results = resultsFromDB.map ((elem) => {
					return (
						<Tr key={elem.id}>
							<Td>{this.parseDate(elem.startDate)}</Td>
							<Td>{this.parseTime(elem.startDate)}</Td>
							<Td>{this.parseTime(elem.endDate)}</Td>
							<Td>
								<ButtonGroup>
									<ActionButton
										buttonText={<span className="fa fa-edit"/>}
										color="primary"
										onClickAction={() => this.changeTimeSlot(elem)}/>
									<ActionButton
										buttonText={<span className="fa fa-close"/>}
										color="primary"
										onClickAction={() => this.cancelTimeSlot(elem)}/>
								</ButtonGroup>
							</Td>
						</Tr>
					);
				});
				this.setState({
					tableEntries: results
				});
			}
		});
	};

	render() {
		return (
			<div className="manage-agenda">
				<h1>Timeslots</h1>
				<Table className="table timeslots-table">
					<Thead>
					<Tr>
						<Th>Date</Th>
						<Th>Start time</Th>
						<Th>End time</Th>
						<Th/>
					</Tr>
					</Thead>
					<Tbody>{this.state.tableEntries}</Tbody>
				</Table>
			  <Button
				onClick={() => this.props.openModal(AddTimeSlot, {refreshPage: this.getTimeslots})}
				className="btn-admin">Add timeslot when you are available
			  </Button>
			</div>
		);
	}
}