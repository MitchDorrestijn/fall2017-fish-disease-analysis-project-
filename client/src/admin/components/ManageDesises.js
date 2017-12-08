import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { Button, Form, FormGroup, Input } from 'reactstrap';
import addFishDesiseAdmin from '../../components/modal/AddFishDesiseAdmin';
import DataAccess from '../../scripts/DataAccess';

export default class ManageDesises extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			searchTerm: "",
			dataFromDB: [],
			data: []
		}
	}
	componentDidMount(){
		this.loadCurrentDiseases();
	}
	loadCurrentDiseases = () => {
		let da = new DataAccess();
		da.getData ('/diseases', (err, res) => {
			if (!err) {
				this.setState({dataFromDB: res.message});
				this.getData();
			} else {
				console.log("De error is: " + err.message);
			}
		});
	}
	getData = () => {
		let data = [];
		for(var key in this.state.dataFromDB) {
    	if(this.state.dataFromDB.hasOwnProperty(key)) {
				let symptoms = null;
				if (this.state.dataFromDB[key].symptoms) {
					symptoms = this.state.dataFromDB[key].symptoms.map ((elem, index) => {
						return <li key={parseInt(index,10)}>{elem}</li>
					});
				}
				data.push(
					<Tr key={parseInt(key,10)}>
						<Td>{this.state.dataFromDB[key].name}</Td>
						<Td><ul>{symptoms}</ul></Td>
						<Td>{this.state.dataFromDB[key].description}</Td>
						<Td>{this.state.dataFromDB[key].treatment}</Td>
					</Tr>
				);
    	}
		}
		this.setState({
			data: data
		})
	}
	updateRecord = (recordToUpdate) => {
  	console.log(recordToUpdate);
	}
	getSearchTerm = (e) => {
		e.preventDefault();
		console.log("SerchTerm: " + this.state.searchTerm);
	}
	handleSearchChange = (e) => {
		this.setState({searchTerm: e.target.value});
	}
	render(){
  	return (
			<div>
				<h2>Add / edit / remove fish desises</h2>
				<Form inline className="searchForm" onSubmit={this.getSearchTerm}>
        	<FormGroup>
          	<Input type="text" name="searchTerm" placeholder="What do you wanna search?" onChange={this.handleSearchChange} />
        	</FormGroup>
					<Button className="btn-admin">Search now</Button>
				</Form>
				<Table className="table">
				  <Thead>
				  	<Tr>
	            <Th>Name</Th>
	            <Th>Symptoms</Th>
							<Th>Description</Th>
							<Th>Treatment</Th>
		        </Tr>
			    </Thead>
				    <Tbody>
							{this.state.data}
				    </Tbody>
				</Table>
				<Button onClick={() => this.props.openModal(addFishDesiseAdmin)} className="btn-admin">Add fish desise</Button>
			</div>
  	);
	}
};
