import React from 'react';
import {Row} from 'reactstrap';
import DiseasePicture from './DiseasePicture';
import DiseaseInfo from './DiseaseInfo';
import DiseaseSymptoms from './DiseaseSymptoms';
import DiseaseTreatment from './DiseaseTreatment';

export default class DiseaseBlock extends React.Component {
	render() {
		return (
			<Row className="result">
			<DiseasePicture src={this.props.picture}/>
			<DiseaseInfo title={this.props.title} info={this.props.info}/>
			<DiseaseSymptoms symptoms={this.props.symptoms}/>
			<DiseaseTreatment treatment={this.props.treatment}/>
			</Row>
		);
	}
}