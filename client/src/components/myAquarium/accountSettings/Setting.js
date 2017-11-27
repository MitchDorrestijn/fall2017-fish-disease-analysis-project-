import React from 'react';
import {Col} from 'reactstrap';

export default class Setting extends React.Component {
	render() {
		return (
			<Col xs="12" md="6">
				{this.props.title}<br/>
				{this.props.children}
			</Col>
		);
	}
}