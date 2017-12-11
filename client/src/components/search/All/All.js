import React from 'react';
import {Col, Row} from 'reactstrap';
import FishesBlock from '../Fishes/Block/FishesBlock';
import DiseaseBlock from '../Diseases/Block/DiseaseBlock';
import DataAccess from '../../../scripts/DataAccess';

export default class SavedAdvices extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			results: []
		};
		this.noSpeciesFound = false;
		this.noDiseasesFound = false;
	}
	
	componentDidMount = () => {
		if(this.props.searchTerm !== ""){
			let da = new DataAccess ();
			da.getData(`/diseases/search?term=` + this.props.searchTerm, (err, res) => {
				if (!err) {
					if(res.message.length > 0){
						let blocks = this.state.results;
						for(let i = 0; i < res.message.length; i++){					
							blocks.push (<DiseaseBlock key={i} picture="schimmel3" title={res.message[i].name} info={res.message[i].description} symptoms={res.message[i].symptoms} treatment={res.message[i].treatment}/>);
						}
						this.setState({results: blocks});
					}else{
						this.noDiseasesFound = true;
						this.setNoResult();
					}
				} else {
					console.log(err);
				}
			});
			da.getData(`/species/search?term=` + this.props.searchTerm, (err, res) => {
				if (!err) {
					if(res.message.length > 0){
						let blocks = this.state.results;
						for(let i = 0; i < res.message.length; i++){					
							blocks.push (<FishesBlock key={i} picture={res.message[i].picture} title={res.message[i].name} info={res.message[i].info} additional={res.message[i].additional}/>);
						}
						this.setState({results: blocks});
					}else{
						this.noSpeciesFound = true;
						this.setNoResult();
					}
				} else {
					console.log(err);
				}
			});
		}else{
			let blocks = [];				
			blocks.push(<p key={0}>No results found</p>);
			this.setState({results: blocks});
		}
	}
	
	setNoResult = () => {
		if(this.noDiseasesFound && this.noSpeciesFound){
			let blocks = [];				
			blocks.push(<p key={0}>No results found</p>);
			this.setState({results: blocks});
		}
	}
	
	render() {
		return (
			<div className="search-results">
				<h1 className="text-center">Search results</h1>
				<hr/>
				<Row>
					<Col lg="12" id="resultList">
						{this.state.results}						
					</Col>
				</Row>
			</div>
		);
	}
}
