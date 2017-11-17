import React from 'react';
import {Col} from 'reactstrap';
import AdvicePicture from './AdvicePicture';
import AdviceInfo from './AdviceInfo';
import AdviceSymptoms from './AdviceSymptoms';

export default class SavedAdvices extends React.Component {
	render() {
		return (
			<div className="saved-advices">
				<h1 className="text-center">Saved advices</h1>
				<Col lg={{size: 8, offset: 2}}>
					<AdvicePicture src="plaatje.jpg"/>
					<AdviceInfo>
						Hoi
					</AdviceInfo>
					<AdviceSymptoms>
						Hoi
					</AdviceSymptoms>
				</Col>
			</div>
		);
	}
}