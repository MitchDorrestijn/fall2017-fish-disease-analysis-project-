import React from 'react';
import {Col, Row} from 'reactstrap';
import AdviceDate from './AdviceDate';
import AdviceMatch from './AdviceMatch';
import AdvicePicture from './AdvicePicture';
import AdviceInfo from './AdviceInfo';
import AdviceSymptoms from './AdviceSymptoms';

export default class SavedAdvices extends React.Component {
	render() {
		return (
			<div className="saved-advices">
				<h1 className="text-center">Saved advices</h1>
					<Col lg="12">
						<Row className="advice">
							<AdvicePicture src="schimmel3"/>
							<AdviceInfo title="White spot disease - Ichthyophthirius multifiliis">
								The white spot disease is one of the most common
								fish diseases. Infected fish have small white spots
								on the skin and gills.It can lead to the loss of
								skin and ulcers. These wounds can harm the ability
								of a fish to control the movement of water into its body.
							</AdviceInfo>
							<AdviceSymptoms>
								<li>White spots</li>
								<li>Wobbling</li>
								<li>No appetite</li>
								<li>Skin disease</li>
							</AdviceSymptoms>
							<AdviceDate>17-11-2017</AdviceDate>
							<AdviceMatch>87</AdviceMatch>
						</Row>
					</Col>
			</div>
		);
	}
}