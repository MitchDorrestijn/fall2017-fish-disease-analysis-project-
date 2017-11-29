import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import InlineEditable from "react-inline-editable-field";
import { Button, Form, FormGroup, Input } from 'reactstrap';

export default class ManageFish extends React.Component {
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
		console.log("SerchTerm: " + this.state.searchTerm);
	}
	handleSearchChange = (e) => {
		this.setState({searchTerm: e.target.value});
	}
	render(){
  	return (
			<div>
				<h2>Vissen toevoegen / bewerken / verwijderen</h2>
				<Form inline className="searchForm" onSubmit={this.getSearchTerm}>
        	<FormGroup>
          	<Input type="text" name="searchTerm" placeholder="Wat wil je zoeken?" onChange={this.handleSearchChange} />
        	</FormGroup>
					<Button>Zoek nu</Button>
				</Form>
				<Table className="table">
				  <Thead>
				  	<Tr>
	            <Th>Vis naam</Th>
	            <Th>Omschrijving</Th>
	            <Th>Afbeelding</Th>
		        </Tr>
			    </Thead>
				    <Tbody>
				        <Tr>
				            <Td><InlineEditable className="editFocus" content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td><InlineEditable className="editFocus" content="Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large." inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td><InlineEditable className="editFocus" content="img/afbeelding.png" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				        </Tr>
								<Tr>
										<Td><InlineEditable content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td><InlineEditable content="Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large." inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td><InlineEditable content="img/afbeelding.png" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				        </Tr>
								<Tr>
										<Td><InlineEditable content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td><InlineEditable content="Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large." inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td><InlineEditable content="img/afbeelding.png" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				        </Tr>
								<Tr>
										<Td><InlineEditable content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td><InlineEditable content="Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large." inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td><InlineEditable content="img/afbeelding.png" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				        </Tr>
								<Tr>
										<Td><InlineEditable content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td><InlineEditable content="Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large." inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td><InlineEditable content="img/afbeelding.png" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				        </Tr>
				    </Tbody>
				</Table>
			</div>
  	);
	}
};
