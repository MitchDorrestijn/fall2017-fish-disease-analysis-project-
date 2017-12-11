import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { Button, Form, FormGroup, Input, ButtonGroup} from 'reactstrap';
import ActionButton from '../../../components/base/ActionButton';
import addNotificationRule from './AddNotificationRule';
import removeNotificationRule from './RemoveNotificationRule';
import changeNotificationRule from './ChangeNotificationRule';
import DataAccess from '../../../scripts/DataAccess';

export default class ManageNotifications extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			searchTerm: '',
			dataFromDB: [],
			data: []
		}
	}
	componentDidMount(){
		this.loadCurrentNotifications();
	}
	loadCurrentNotifications = () => {
		let da = new DataAccess();
		da.getData ('/notifications/rules', (err, res) => {
			if (!err) {
				this.setState({dataFromDB: res.message});
				this.getData();
			} else {
				console.log('De error is: ' + err.message);
			}
		});
	}
	getData = () => {
		let data = [];
		for(var key in this.state.dataFromDB) {
    	if(this.state.dataFromDB.hasOwnProperty(key)) {
				let element = this.state.dataFromDB[key];
				data.push(
					<Tr key={parseInt(key,10)}>
						<Td>{element.attribute}</Td>
						<Td>{element.equation}</Td>
						<Td>{element.compared}</Td>
						<Td>{element.min}</Td>
						<Td>{element.max}</Td>
						<Td>{element.message}</Td>
						<Td>{element.type}</Td>
						<Td>
							<ButtonGroup>
								<ActionButton
									buttonText={<span className='fa fa-edit'/>}
									color='primary'
									onClickAction={() => this.changeNotificationRule(element)}/>
								<ActionButton
									buttonText={<span className='fa fa-close'/>}
									color='primary'
									onClickAction={() => this.removeNotificationRule(element)}/>
							</ButtonGroup>
						</Td>
					</Tr>
				);
    	}
		}
		this.setState({
			data: data
		})
	}
	removeNotificationRule = (entry) => {
		this.props.openModal(removeNotificationRule, {
			refreshPage: this.loadCurrentNotifications,
			entry: entry
		});
	};
	changeNotificationRule = (entry) => {
		this.props.openModal(changeNotificationRule, {
			refreshPage: this.getData,
			entry: entry
		});
	};
	updateRecord = (recordToUpdate) => {
  	console.log(recordToUpdate);
	}
	getSearchTerm = (e) => {
		e.preventDefault();
		console.log('SearchTerm: ' + this.state.searchTerm);
	}
	handleSearchChange = (e) => {
		this.setState({searchTerm: e.target.value});
	}
	render(){
		return (
			<div>
				<h2>Add / edit / remove notification rules</h2>
				{/* <Form inline className='searchForm' onSubmit={this.getSearchTerm}>
					<FormGroup>
						<Input type='text' name='searchTerm' placeholder='What do you wanna search?' onChange={this.handleSearchChange} />
					</FormGroup>
					<Button className='btn-admin'>Search now</Button>
				</Form> */}
				<Table className='table'>
					<Thead>
						<Tr>
							<Th>Attribute</Th>
							<Th>Equation</Th>
							<Th>Compared</Th>
							<Th>Min</Th>
							<Th>Max</Th>
							<Th>Message</Th>
							<Th>Type</Th>
							<Th>Edit</Th>
						</Tr>
					</Thead>
					<Tbody>
						{this.state.data}
					</Tbody>
				</Table>
				<Button onClick={() => this.props.openModal(addNotificationRule, {refreshPage: this.loadCurrentNotifications})} className='btn-admin'>Add notification rule</Button>
			</div>
		);
	};
};
