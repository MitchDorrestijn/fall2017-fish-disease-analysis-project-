import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { Button, Form, FormGroup, Input, ButtonGroup } from 'reactstrap';
import addFishDesiseAdmin from '../../components/modal/AddFishDiseaseAdmin';
import DataAccess from '../../scripts/DataAccess';
import ActionButton from '../../components/base/ActionButton';
import RemoveDisease from '../../components/modal/RemoveDisease';
import EditDisease from '../../components/modal/EditDisease';
import EditImageDisease from '../../components/modal/EditImageDisease';


export default class ManageDiseases extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			searchTerm: "",
			data: [],
			userHasSearched: false,
			error: ""
		}
	}
	componentDidMount(){
		this.loadCurrentDiseases();
	}
	loadCurrentDiseases = () => {
		let da = new DataAccess();
		da.getData ('/diseases', (err, res) => {
			if (!err) {
				this.getData(res.message);
				this.setState({userHasSearched: false, error: ""});
			} else {
				console.log("De error is: " + err.message);
			}
		});
	}
	removeDisease = (entry) => {
		this.props.openModal(RemoveDisease, {
			refreshPage: this.loadCurrentDiseases,
			entry: entry
		});
	};
	editDisease = (entry) => {
		this.props.openModal(EditDisease, {
			refreshPage: this.loadCurrentDiseases,
			entry: entry
		});
	};
	editImage = (entry) => {
		this.props.openModal(EditImageDisease, {
			refreshPage: this.loadCurrentDiseases,
			entry: entry
		});
	}
	getData = (results) => {
		let data = [];
		for(var key in results) {
    	if(results.hasOwnProperty(key)) {
				let symptoms = null;
				if (results[key].symptoms) {
					symptoms = results[key].symptoms.map ((elem, index) => {
						return <li key={parseInt(index,10)}>{elem}</li>
					});
				}
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
						<Td>[{element.code}] {element.name}</Td>
						<Td><ul>{symptoms}</ul></Td>
						<Td>{element.description}</Td>
						<Td>{element.treatment}</Td>
						<Td>
							<ButtonGroup>
								<ActionButton
									buttonText={<span className="fa fa-close"/>}
									color="primary"
								  onClickAction={() => this.removeDisease(element)}
								/>
							</ButtonGroup>
							<ButtonGroup>
								<ActionButton
									buttonText={<span className="fa fa-edit"/>}
									color="primary"
									onClickAction={() => this.editDisease(element)}
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
	updateRecord = (recordToUpdate) => {
  	console.log(recordToUpdate);
	}
	getSearchTerm = (e) => {
		e.preventDefault();
		let da = new DataAccess();
		da.getData (`/diseases/search?term=${this.state.searchTerm}`, (err, res) => {
			if (!err) {
				this.getData(res.message);
				this.setState({userHasSearched: true, error: ""});
				if(res.message.length === 0) {
					this.setState({error: "No results found."});
				}
			} else {
				console.log("De error is: " + err.message);
				this.setState({error: "Please type a search term!"});
			}
		});
	}
	handleSearchChange = (e) => {
		this.setState({searchTerm: e.target.value});
	}
	render(){
		return (
			<div>
				<h2>Add / edit / remove diseases</h2>
				<Form inline className="searchForm" onSubmit={this.getSearchTerm}>
					<FormGroup>
						<Input type="text" name="searchTerm" placeholder="What do you wanna search?" onChange={this.handleSearchChange} />
					</FormGroup>
					<Button className="btn-admin">Search now</Button>
					&nbsp; {this.state.userHasSearched && <Button className="btn-admin" onClick={this.loadCurrentDiseases}><i className="fa fa-arrow-circle-left"></i> Go back</Button>}
				</Form>
				<div className="search-errors">
					{this.state.error}
				</div>
				<Table className="table">
					<Thead>
						<Tr>
							<Th>Picture</Th>
							<Th>[Code] Name</Th>
							<Th>Symptoms</Th>
							<Th>Description</Th>
							<Th>Treatment</Th>
							<Th>Edit</Th>
						</Tr>
					</Thead>
				    <Tbody>
						{this.state.data}
				    </Tbody>
				</Table>
				<Button onClick={() => this.props.openModal(addFishDesiseAdmin, {refreshPage: this.loadCurrentDiseases})} className="btn-admin">Add disease</Button>
			</div>
		);
	}
};
