import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { Button, Form, FormGroup, Input, ButtonGroup } from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';

export default class ManageFish extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			data: []
		}
	}
	componentDidMount(){
		this.loadSpecies();
	}
	loadSpecies = () => {
		let da = new DataAccess();
		da.getData ('/species', (err, res) => {
			if (!err) {
				this.getData(res.message);
			} else {
				console.log("De error is: " + err.message);
			}
		});
	}
	getData = (results) => {
		let data = [];
		for(var key in results) {
    	if(results.hasOwnProperty(key)) {
				let element = results[key];
				let image;
				if(element.imageUrl) {
					image = <img className="img-fluid" src={element.imageUrl} alt={element.imageUrl} />;
				} else {
					image = <span>No image uploaded yet</span>
				}
				data.push(
					<Tr key={parseInt(key,10)}>
						<Td>{image}</Td>
						<Td>{element.name}</Td>
						<Td>{element.info}</Td>
						<Td>{element.additional}</Td>
						<Td>
							<ButtonGroup>
								<ActionButton
									buttonText={<span className="fa fa-close"/>}
									color="primary"
								  onClickAction={() => this.removeSpecies(element)}
								/>
							</ButtonGroup>
							<ButtonGroup>
								<ActionButton
									buttonText={<span className="fa fa-edit"/>}
									color="primary"
									onClickAction={() => this.editSpecies(element)}
								/>
							</ButtonGroup>
							<ButtonGroup>
								<ActionButton
									buttonText={<span className="fa fa-image"/>}
									color="primary"
									onClickAction={() => this.editImage(element)}
								/>
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
	render(){
  	return (
			<div>
				<h2>Add / edit / remove fish</h2>
				<Table className="table">
				  <Thead>
				  	<Tr>
							<Th>Picture</Th>
	            <Th>Name</Th>
	            <Th>Info</Th>
							<Th>Additional</Th>
							<Th>Edit</Th>
		        </Tr>
			    </Thead>
				    <Tbody>
							{this.state.data}
				    </Tbody>
				</Table>
				<Button onClick={() => this.props.openModal(AddFishAdmin, {refreshPage: this.loadSpecies})} className="btn-admin">Add fish</Button>
			</div>
  	);
	}
};
