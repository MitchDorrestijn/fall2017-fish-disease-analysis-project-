import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { Button, Form, FormGroup, Input, ButtonGroup } from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';
import ActionButton from '../../components/base/ActionButton';
import AddFishAdmin from '../../components/modal/AddFishAdmin';
import RemoveSpecies from '../../components/modal/RemoveSpecies';
import EditSpecies from '../../components/modal/EditSpecies';
import EditImageAddFish from '../../components/modal/EditImageAddFish';

export default class ManageFish extends React.Component {
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
		this.loadSpecies();
	}
	loadSpecies = () => {
		let da = new DataAccess();
		da.getData ('/species', (err, res) => {
			if (!err) {
				this.getData(res.message);
				this.setState({userHasSearched: false, error: ""});
			} else {
				console.log("De error is: " + err.message);
			}
		});
	}
	removeSpecies = (entry) => {
		this.props.openModal(RemoveSpecies, {
			refreshPage: this.loadSpecies,
			entry: entry
		});
	};
	editSpecies = (entry) => {
		this.props.openModal(EditSpecies, {
			refreshPage: this.loadSpecies,
			entry: entry
		});
	};
	editImage = (entry) => {
		this.props.openModal(EditImageAddFish, {
			refreshPage: this.loadSpecies,
			entry: entry
		});
	}
	getData = (results) => {
		let data = [];
		for(var key in results) {
    	if(results.hasOwnProperty(key)) {
				let element = results[key];
				data.push(
					<Tr key={parseInt(key,10)}>
						<Td>{element.name}</Td>
						<Td>{element.info}</Td>
						<Td>{element.additional}</Td>
						<Td><img className="img-fluid" src={element.picture} alt="Fish" /></Td>
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
	getSearchTerm = (e) => {
		e.preventDefault();
		let da = new DataAccess();
		da.getData (`/species/search?term=${this.state.searchTerm}`, (err, res) => {
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
				<h2>Add / edit / remove fish</h2>
				<Form inline className="searchForm" onSubmit={this.getSearchTerm}>
        	<FormGroup>
          	<Input type="text" name="searchTerm" placeholder="What do you wanna search?" onChange={this.handleSearchChange} />
        	</FormGroup>
					<Button className="btn-admin">Search now</Button>
					&nbsp; {this.state.userHasSearched && <Button className="btn-admin" onClick={this.loadSpecies}><i className="fa fa-arrow-circle-left"></i> Go back</Button>}
				</Form>
				<div className="search-errors">
					{this.state.error}
				</div>
				<Table className="table">
				  <Thead>
				  	<Tr>
	            <Th>Name</Th>
	            <Th>Info</Th>
							<Th>Additional</Th>
							<Th>Picture</Th>
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
