import React from 'react';
import {Row} from 'reactstrap';
import FishPicture from './FishPicture';
import FishInfo from './FishInfo';
import FishExtra from './FishExtra';

export default class FishBlock extends React.Component {
	render() {
		return (
			<Row className="result">
				<FishPicture src={this.props.picture}/>
				<FishInfo title={this.props.title} info={this.props.info}/>
				<FishExtra extra={this.props.extra}/>
			</Row>
		);
	}
}