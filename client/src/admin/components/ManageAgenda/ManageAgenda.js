import React, {Component} from 'react';
import {Table, Th, Tr, Td, Thead, Tbody} from 'react-super-responsive-table';
import {ButtonGroup} from 'reactstrap';
import ActionButton from '../../../components/base/ActionButton';
import RemoveAppointment from './RemoveAppointment';
import ChangeAppointment from './ChangeAppointment';
import ApproveAppointment from './ApproveAppointment';
import DataAccess from '../../../scripts/DataAccess';

export default class ManageAgenda extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tableEntries: []
		};
	}

	componentWillMount() {
		this.getAppointments();
	}

	sortAppointmentsByDate = (a, b) => {
		let aDate = new Date(a.timeslot.startDate);
		let bDate = new Date(b.timeslot.startDate);
		if (aDate > bDate)
			return -1;
		if (aDate < bDate)
			return 1;
		return 0;
	};

	parseDate = (date) => {
		let parsedDate = new Date (date);
		return parsedDate.toDateString();
	};

	parseTime = (date) => {
		let parsedDate = new Date (date);
		let hours = parsedDate.getHours();
		let minutes = parsedDate.getMinutes();
		if (minutes < 10) {
			minutes = minutes + "0";
		}
		return `${hours}:${minutes}`;
	};

	cancelAppointment = (entry) => {
		this.props.openModal(RemoveAppointment, {
			refreshPage: this.getAppointments,
			entry: entry
		});
	};

	changeAppointment = (entry) => {
		this.props.openModal(ChangeAppointment, {
			refreshPage: this.getAppointments,
			entry: entry
		});
	};

	approveAppointment = (entry) => {
		this.props.openModal(ApproveAppointment, {
			refreshPage: this.getAppointments,
			entry: entry
		});
	};

	getAppointments = () => {
		// Hier moeten afspraken worden opgehaald en in "results" worden gezet
		// Bij de onClickAction moet het id van de afspraak worden meegegeven
		let results = [];

		let da = new DataAccess();

		da.getData('/admin/appointments', (err, res) => {
			if (!err) {
				let resultsFromDB = res.message;
				resultsFromDB.sort (this.sortAppointmentsByDate);
				for (let i = 0; i < resultsFromDB.length; i++) {
					if (resultsFromDB[i].canceled) {
						resultsFromDB.splice(i, 1);
						i--;
					}
				}
				results = resultsFromDB.map ((elem) => {
					return (
						<Tr key={elem.id}>
							<Td>{this.parseDate(elem.timeslot.startDate)}</Td>
							<Td>{this.parseTime(elem.timeslot.startDate)}</Td>
							<Td>{this.parseTime(elem.timeslot.endDate)}</Td>
							<Td>{elem.reservedBy}</Td>
							<Td>{elem.comment}</Td>
							<Td>{elem.status ? "Open" : "Closed"}</Td>
							{/*<Td>{elem.approved ? "Yes" : "No"}</Td>*/}
							<Td>
								<ButtonGroup>

									<ActionButton
										buttonText={<span className="fa fa-close"/>}
										color="primary"
										onClickAction={() => this.cancelAppointment(elem)}/>
								  <ActionButton buttonText='Chat room'
												linkTo={"/chat/admin/" + elem.id}
												color='primary btn-transperant'/>
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
				<h1>Appointments</h1>
				<Table className="table appointment-table">
					<Thead>
						<Tr>
							<Th>Date</Th>
							<Th>Start time</Th>
							<Th>End time</Th>
							<Th>Person</Th>
							<Th>Description</Th>
							<Th>Status</Th>
							{/*<Th>Cancelled</Th>*/}
						  	<Th></Th>
							<Th/>
						</Tr>
					</Thead>
					<Tbody>{this.state.tableEntries}</Tbody>
				</Table>
			</div>
		);
	}
}
