import React from 'react';
import {Col, Row} from 'reactstrap';
import DiseaseBlock from './Block/DiseaseBlock'

export default class Diseases extends React.Component {
	render() {
		return (
			<div className="search-results">
				<h1 className="text-center">Diseases</h1>
				<hr/>
				<Row>
					<Col xs="12">						
						<DiseaseBlock
							picture="schimmel3"
							title="White spot disease - Ichthyophthirius multifiliis"
							info="The white spot disease is one of the most common fish diseases. Infected fish have small white spots on the skin and gills.It can lead to the loss of skin and ulcers. These wounds can harm the ability of a fish to control the movement of water into its body."
							symptoms={["White spots", "Wobbling", "No appetite", "Skin disease"]}
							treatment="Treatment"
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
