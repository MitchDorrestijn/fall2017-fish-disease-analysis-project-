import React from 'react';
// import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { Button, Form, FormGroup, Input, ButtonGroup, Table, thead, tbody, tr, th, td } from 'reactstrap';
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
		};
	};

	//modals functions:
	removeNotificationRule = (entry) => {
		this.props.openModal(removeNotificationRule, {
			refreshPage: this.loadCurrentNotifications,
			entry: entry
		});
	};
	changeNotificationRule = (entry) => {
		this.props.openModal(changeNotificationRule, {
			refreshPage: this.fillData,
			entry: entry
		});
	};

	//component mount/unmount functions:
	componentDidMount(){
		this.loadCurrentNotifications();
	};

	//get/post/put data functions:
	loadCurrentNotifications = () => {
		let da = new DataAccess();
		da.getData ('/notifications/rules', (err, res) => {
			if (!err) {
				this.setState({dataFromDB: res.message});
				this.fillData();
			} else {
				console.log('De error is: ' + err.message);
			};
		});
	};

	checkRowspanTable = (data, index) => {
		if (index == 0) {
			return (data)
		}
	}

	//fill table functions:
	fillData = () => {
		let data = [];
		//runs through all the keys from the returned database, and makes a row for every key
		for(var key1 in this.state.dataFromDB) {
    	if(this.state.dataFromDB.hasOwnProperty(key1)) {
				let element = this.state.dataFromDB[key1];
				for(var key2 in element.triggers) {
					if(element.triggers.hasOwnProperty(key2)) {
						data.push(
							<tr key={`${key1}.${key2}`}>
								{this.checkRowspanTable(<td rowSpan={Object.keys(element.triggers).length}>{element.message}</td>, key2)}
								<td>{element.triggers[key2].attribute}</td>
								<td>{element.triggers[key2].equation}</td>
								<td>{element.triggers[key2].compared}</td>
								<td>{element.triggers[key2].min}</td>
								<td>{element.triggers[key2].max}</td>
								{this.checkRowspanTable(<td rowSpan={Object.keys(element.triggers).length}>{element.type}</td>, key2)}
								{this.checkRowspanTable(
									<td rowSpan={Object.keys(element.triggers).length}>
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
									</td>,
								key2)}
							</tr>
						);
					};
				};
    	};
		};
		this.setState({
			data: data
		});
	};

	render(){
		return (
			<div>
				<h2>Add / edit / remove notification rules</h2>
				<Table responsive className='multiRowTable'>
					<thead>
						<tr>
							<th>Message</th>
							<th>Attribute</th>
							<th>Equation</th>
							<th>Compared</th>
							<th>Min</th>
							<th>Max</th>
							<th>Type</th>
							<th>Edit</th>
						</tr>
					</thead>
					<tbody>
						{this.state.data}
					</tbody>
				</Table>
				<Button onClick={() => this.props.openModal(addNotificationRule, {refreshPage: this.loadCurrentNotifications})} className='btn-admin'>Add notification rule</Button>
			</div>
		);
	};
};
