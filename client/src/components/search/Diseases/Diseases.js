import React from 'react';
import {Col, Row} from 'reactstrap';
import DiseaseBlock from './Block/DiseaseBlock';
import DataAccess from '../../../scripts/DataAccess';

export default class Diseases extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			blocks: []
		};
	}
	
	componentDidMount = () => {
		let da = new DataAccess ();
		da.getData(`/diseases/search?term=` + this.props.searchTerm, (err, res) => {
			if (!err) {
				if(res.message.length > 0){
					let blocks = [];
					for(let i = 0; i < res.message.length; i++){					
						blocks.push (<DiseaseBlock key={i} picture="schimmel3" title={res.message[i].name} info={res.message[i].description} symptoms={res.message[i].symptoms} treatment={res.message[i].treatment}/>);
					}
					this.setState({blocks: blocks});
				}else{
					let blocks = [];				
					blocks.push(<p key={0}>No results found</p>);
					this.setState({blocks: blocks});
				}
			} else {
				console.log(err);
			}
		});
	}
	
	render() {
		return (
			<div className="search-results">
				<h1 className="text-center">Diseases</h1>
				<hr/>
				<Row>
					<Col xs="12">						
						{this.state.blocks}
					</Col>
				</Row>
			</div>
		);
	}
}
