import React from 'react';
import {Col, Row} from 'reactstrap';
import FishesBlock from './Block/FishesBlock';
import DataAccess from '../../../scripts/DataAccess';

export default class Fishes extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			blocks: []
		};
	}
	
	componentDidMount = () => {
		if(this.props.searchTerm !== ""){
			let da = new DataAccess ();
			da.getData(`/species/search?term=` + this.props.searchTerm, (err, res) => {
				if (!err) {
					if(res.message.length > 0){
						let blocks = [];
						for(let i = 0; i < res.message.length; i++){					
							blocks.push (<FishesBlock key={i} picture={res.message[i].picture} title={res.message[i].name} info={res.message[i].info} additional={res.message[i].additional}/>);
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
		}else{
			let blocks = [];				
			blocks.push(<p key={0}>No results found</p>);
			this.setState({blocks: blocks});
		}
	}
	
	render() {
		return (
			<div className="search-results">
				<h1 className="text-center">Fishes</h1>
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
