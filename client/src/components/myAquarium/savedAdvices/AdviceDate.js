import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class AdviceDate extends Component {
	render() {
		return (
			<Col lg="6" className="header">
				{this.props.children}
			</Col>
		);
	}
}
