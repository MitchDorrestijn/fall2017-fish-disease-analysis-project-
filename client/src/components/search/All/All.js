import React from 'react';
import {Col, Row} from 'reactstrap';
import FishBlock from '../Fish/Block/FishBlock';
import DiseaseBlock from '../Diseases/Block/DiseaseBlock';

export default class SavedAdvices extends React.Component {
	render() {
		return (
			<div className="search-results">
				<h1 className="text-center">Search results</h1>
				<hr/>
				<Row>
					<Col lg="12">
						<FishBlock
							picture="catfish.jpg"
							title="White spot disease - Ichthyophthirius multifiliis"
							info="The white spot disease is one of the most common fish diseases. Infected fish have small white spots on the skin and gills.It can lead to the loss of skin and ulcers. These wounds can harm the ability of a fish to control the movement of water into its body."
						/>
						
						<DiseaseBlock
							picture="schimmel3"
							title="White spot disease - Ichthyophthirius multifiliis"
							info="The white spot disease is one of the most common fish diseases. Infected fish have small white spots on the skin and gills.It can lead to the loss of skin and ulcers. These wounds can harm the ability of a fish to control the movement of water into its body."
							symptoms={["White spots", "Wobbling", "No appetite", "Skin disease"]}
							treatment="Treatment"
						/>
					</Col>
				</Row>
			</div>
		);
	}
}
