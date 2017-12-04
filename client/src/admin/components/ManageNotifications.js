import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import InlineEditable from "react-inline-editable-field";
import { Button, Form, FormGroup, Input } from 'reactstrap';
import addNotificationRule from '../../components/modal/AddNotificationRule';

export default class ManageNotifications extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			searchTerm: ""
		}
	}
	updateRecord = (recordToUpdate) => {
  	console.log(recordToUpdate);
	}
	getSearchTerm = (e) => {
		e.preventDefault();
		console.log("SearchTerm: " + this.state.searchTerm);
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
							<Th>Attribute</Th>
							<Th>Equation</Th>
							<Th>Compared</Th>
							<Th>Message</Th>
						</Tr>
					</Thead>
					<Tbody>
						<Tr>
									<Td><InlineEditable className="editFocus" content="ph" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="<" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="7" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="De waarde van {attribute} is met {value} te laag voor aquarium: {aquarium}!" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
								</Tr>
								<Tr>
									<Td><InlineEditable className="editFocus" content="ph" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="<" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="7" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="De waarde van {attribute} is met {value} te laag voor aquarium: {aquarium}!" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
								</Tr>
								<Tr>
									<Td><InlineEditable className="editFocus" content="ph" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="<" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="7" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="De waarde van {attribute} is met {value} te laag voor aquarium: {aquarium}!" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
								</Tr>
								<Tr>
									<Td><InlineEditable className="editFocus" content="ph" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="<" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="7" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="De waarde van {attribute} is met {value} te laag voor aquarium: {aquarium}!" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
								</Tr>
								<Tr>
									<Td><InlineEditable className="editFocus" content="ph" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="<" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="7" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="De waarde van {attribute} is met {value} te laag voor aquarium: {aquarium}!" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
								</Tr>
							</Tbody>
				</Table>
				<Button onClick={() => this.props.openModal(addNotificationRule)} className="btn-admin">Add fish desise</Button>
			</div>
		);
	};
};
