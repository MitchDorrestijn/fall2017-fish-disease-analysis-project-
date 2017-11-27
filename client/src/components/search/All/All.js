import React from 'react';
import {Col, Row} from 'reactstrap';
import FishesBlock from '../Fishes/Block/FishesBlock';
import DiseaseBlock from '../Diseases/Block/DiseaseBlock';
import DataAccess from '../../../scripts/DataAccess';

export default class SavedAdvices extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			species: [],
			diseases: []
		};
	}
	
	componentDidMount = () => {
		if(this.props.searchTerm !== ""){
			let da = new DataAccess ();
			da.getData(`/diseases/search?term=` + this.props.searchTerm, (err, res) => {
				if (!err) {
					if(res.message.length > 0){
						let blocks = [];
						for(let i = 0; i < res.message.length; i++){					
							blocks.push (<DiseaseBlock key={i} picture="schimmel3" title={res.message[i].name} info={res.message[i].description} symptoms={res.message[i].symptoms} treatment={res.message[i].treatment}/>);
						}
						this.setState({diseases: blocks});
					}else{
						let blocks = [];				
						blocks.push(<p key={0}>No results found</p>);
						this.setState({diseases: blocks});
					}
				} else {
					console.log(err);
				}
			});
			da.getData(`/species/search?term=` + this.props.searchTerm, (err, res) => {
				if (!err) {
					if(res.message.length > 0){
						let blocks = [];
						for(let i = 0; i < res.message.length; i++){					
							blocks.push (<FishesBlock key={i} picture={res.message[i].picture} title={res.message[i].name} info={res.message[i].info} additional={res.message[i].additional}/>);
						}
						this.setState({species: blocks});
					}else{
						let blocks = [];				
						blocks.push(<p key={0}>No results found</p>);
						this.setState({species: blocks});
					}
				} else {
					console.log(err);
				}
			});
		}else{
			let blocks = [];				
			blocks.push(<p key={0}>No results found</p>);
			this.setState({diseases: blocks});
		}
	}
	
	render() {
		return (
			<div className="search-results">
				<h1 className="text-center">Search results</h1>
				<hr/>
				<Row>
					<Col lg="12" id="resultList">
						{this.state.diseases}	
						{this.state.species}							
					</Col>
				</Row>
			</div>
		);
	}
}
