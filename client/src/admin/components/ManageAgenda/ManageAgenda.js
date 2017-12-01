import React, {Component} from 'react';
import {Table, Th, Tr, Td, Thead, Tbody} from 'react-super-responsive-table';
import {ButtonGroup} from 'reactstrap';
import ActionButton from '../../../components/base/ActionButton';
import RemoveAppointment from './RemoveAppointment';
import ChangeAppointment from './ChangeAppointment';
import ApproveAppointment from './ApproveAppointment';

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

		// Voorbeeld van een array van afspraken
		let resultsFromDB = [{
			id: "weorij3874893sjdo",
			date: "20-10-2019",
			time: "16:00-17:00",
			person: "Piet",
			description: "Het betreft een hele zieke vis :(",
			video: true,
			approved: false
		}, {
			id: "aoiej39t08jfei390",
			date: "20-10-2019",
			time: "17:00-18:00",
			person: "Henk",
			description: "Het betreft een dooie vis :(",
			video: false,
			approved: true
		}];

		results = resultsFromDB.map ((elem) => {
			return (
				<Tr key={elem.id}>
					<Td>{elem.date}</Td>
					<Td>{elem.time}</Td>
					<Td>{elem.person}</Td>
					<Td>{elem.description}</Td>
					<Td>{elem.video ? "Yes" : "No"}</Td>
					<Td>{elem.approved ? "Yes" : "No"}</Td>
					<Td>
						<ButtonGroup>
							{elem.approved ?
								<ActionButton
									buttonText={<span className="fa fa-edit"/>}
									color="primary"
									onClickAction={() => this.changeAppointment(elem)}/> :
								<ActionButton
									buttonText={<span className="fa fa-check"/>}
									color="primary"
									onClickAction={() => this.approveAppointment(elem)}/>
							}
							<ActionButton
								buttonText={<span className="fa fa-close"/>}
								color="primary"
								onClickAction={() => this.cancelAppointment(elem)}/>
						</ButtonGroup>
					</Td>
				</Tr>
			);
		});
		this.setState({
			tableEntries: results
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
							<Th>Time</Th>
							<Th>Person</Th>
							<Th>Description</Th>
							<Th>Video</Th>
							<Th>Approved</Th>
							<Th/>
						</Tr>
					</Thead>
					<Tbody>{this.state.tableEntries}</Tbody>
				</Table>
			</div>
		);
	}
}
