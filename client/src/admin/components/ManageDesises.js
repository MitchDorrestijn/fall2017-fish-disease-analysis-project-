import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import InlineEditable from "react-inline-editable-field";
import { Button, Form, FormGroup, Input } from 'reactstrap';
import addFishDesiseAdmin from '../../components/modal/AddFishDesiseAdmin';

export default class ManageDesises extends React.Component {
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
	            <Th>Fish name</Th>
	            <Th>Syntoms</Th>
							<Th>Description</Th>
							<Th>Image</Th>
		        </Tr>
			    </Thead>
				    <Tbody>
				        <Tr>
										<Td><InlineEditable className="editFocus" content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
										<Td><InlineEditable className="editFocus" content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td><InlineEditable className="editFocus" content="Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large." inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td><InlineEditable className="editFocus" content="img/afbeelding.png" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				        </Tr>
								<Tr>
									<Td><InlineEditable className="editFocus" content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large." inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="img/afbeelding.png" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				        </Tr>
								<Tr>
									<Td><InlineEditable className="editFocus" content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large." inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="img/afbeelding.png" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				        </Tr>
								<Tr>
									<Td><InlineEditable className="editFocus" content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large." inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="img/afbeelding.png" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				        </Tr>
								<Tr>
									<Td><InlineEditable className="editFocus" content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="Potvis" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large." inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
									<Td><InlineEditable className="editFocus" content="img/afbeelding.png" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				        </Tr>
				    </Tbody>
				</Table>
				<Button onClick={() => this.props.openModal(addFishDesiseAdmin)} className="btn-admin">Add fish desise</Button>
			</div>
  	);
	}
};
