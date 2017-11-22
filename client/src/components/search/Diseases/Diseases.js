import React from 'react';
import {Col, Row} from 'reactstrap';
import LeesMeer from '../General/LeesMeer';
import ResultPicture from '../General/ResultPicture';
import ResultInfo from '../General/ResultInfo';
import QuickNotes from '../General/QuickNotes';

export default class SavedAdvices extends React.Component {
	render() {
		return (
			<div className="saved-advices">
				<h1 className="text-center">Searched disease results</h1>
					<Col lg="12">
						<Row className="advice">
							<ResultPicture src="schimmel3"/>
							<ResultInfo title="White spot disease - Ichthyophthirius multifiliis">
								The white spot disease is one of the most common
								fish diseases. Infected fish have small white spots
								on the skin and gills.It can lead to the loss of
								skin and ulcers. These wounds can harm the ability
								of a fish to control the movement of water into its body.
							</ResultInfo>
							<QuickNotes>
								<li>White spots</li>
								<li>Wobbling</li>
								<li>No appetite</li>
								<li>Skin disease</li>
							</QuickNotes>
							<LeesMeer>Lees meer...</LeesMeer>
						</Row>
					</Col>
			</div>
		);
	}
}
