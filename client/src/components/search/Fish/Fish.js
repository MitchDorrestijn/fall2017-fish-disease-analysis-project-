import React from 'react';
import {Col, Row} from 'reactstrap';
import FishBlock from './Block/FishBlock';

export default class SavedAdvices extends React.Component {
	render() {
		return (
			<div className="search-results">
				<h1 className="text-center">Fishes</h1>
				<hr/>
				<Row>
					<Col lg="12">
						<FishBlock
							picture="catfish.jpg"
							title="White spot disease - Ichthyophthirius multifiliis"
							info="The white spot disease is one of the most common fish diseases. Infected fish have small white spots on the skin and gills.It can lead to the loss of skin and ulcers. These wounds can harm the ability of a fish to control the movement of water into its body."
						/>
					</Col>
				</Row>
			</div>
		);
	}
}
