import React from 'react';
import {Row} from 'reactstrap';
import FishesPicture from './FishesPicture';
import FishesInfo from './FishesInfo';
import FishesAdditional from './FishesAdditional';

export default class FishesBlock extends React.Component {
	render() {
		return (
			<Row className="result">
				<FishesPicture src={this.props.picture}/>
				<FishesInfo title={this.props.title} info={this.props.info}/>
				<FishesAdditional additional={this.props.additional}/>
			</Row>
		);
	}
}