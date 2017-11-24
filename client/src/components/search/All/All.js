import React from 'react';
import {Col, Row} from 'reactstrap';
import FishBlock from '../Fish/Block/FishBlock';
import DiseaseBlock from '../Diseases/Block/DiseaseBlock';
import DataAccess from '../../../scripts/DataAccess';

export default class SavedAdvices extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			blocks: []
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
				<h1 className="text-center">Search results</h1>
				<hr/>
				<Row>
					<Col lg="12" id="resultList">
						<FishBlock
							picture="catfish.jpg"
							title="Catfish"
							info="Catfish are a diverse group of ray-finned fish. Named for their prominent barbels, which resemble a cat's whiskers, catfish range in size and behavior from the three largest species, the Mekong giant catfish from Southeast Asia, the wels catfish of Eurasia and the piraíba of South America, to detritivores, and even to a tiny parasitic species commonly called the candiru, Vandellia cirrhosa. There are armour-plated types and there are also naked types, neither having scales. Despite their name, not all catfish have prominent."
						/>
						<br/>
						{this.state.blocks}					
					</Col>
				</Row>
			</div>
		);
	}
}
