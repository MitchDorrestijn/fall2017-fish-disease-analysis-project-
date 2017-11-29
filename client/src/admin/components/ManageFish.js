import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import InlineEditable from "react-inline-editable-field";


export default class ManageFish extends React.Component {
	updateRecord = (recordToUpdate) => {
  	console.log(recordToUpdate);
	}
	render(){
  	return (
			<div>
				<Table>
				  <Thead>
				  	<Tr>
	            <Th>ID</Th>
	            <Th>Vis naam</Th>
	            <Th>Omschrijving</Th>
	            <Th>Afbeelding</Th>
		        </Tr>
			    </Thead>
				    <Tbody>
				        <Tr>
				            <Td>1</Td>
				            <Td><InlineEditable content="uit database" inputType="text" onBlur={(recordToUpdate) => {this.updateRecord(recordToUpdate)}}/></Td>
				            <Td>Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.</Td>
				            <Td>img/afbeelding.png</Td>
				        </Tr>
								<Tr>
				            <Td>1</Td>
				            <Td>Potvis</Td>
				            <Td>Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.</Td>
				            <Td>img/afbeelding.png</Td>
				        </Tr>
								<Tr>
				            <Td>1</Td>
				            <Td>Potvis</Td>
				            <Td>Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.</Td>
				            <Td>img/afbeelding.png</Td>
				        </Tr>
								<Tr>
				            <Td>1</Td>
				            <Td>Potvis</Td>
				            <Td>Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.</Td>
				            <Td>img/afbeelding.png</Td>
				        </Tr>
								<Tr>
				            <Td>1</Td>
				            <Td>Potvis</Td>
				            <Td>Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.</Td>
				            <Td>img/afbeelding.png</Td>
				        </Tr>
				    </Tbody>
				</Table>
			</div>
  	);
	}
};
