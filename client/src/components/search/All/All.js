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
			let da = new DataAccess (true);
			da.getData(`/species-and-diseases/search?term=` + this.props.searchTerm, (err, res) => {
				if (!err) {
					if(res.message.length > 0){
						let blocks = [];
						for(let i = 0; i < res.message.length; i++){
							if(res.message[i].symptoms){
								blocks.push (<DiseaseBlock key={i} picture={res.message[i].imageUrl} title={res.message[i].name} info={res.message[i].description} symptoms={res.message[i].symptoms} treatment={res.message[i].treatment}/>);
							}else{
								blocks.push (<FishesBlock key={i} picture={res.message[i].imageUrl} title={res.message[i].name} info={res.message[i].info} additional={res.message[i].additional}/>);
							}
						}
						this.setState({results: blocks});
					}else{
						let blocks = [];				
						blocks.push(<p key={0}>No results found</p>);
						this.setState({results: blocks});
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
