import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class AdviceMatch extends Component {
	render() {
		return (
			<Col lg="6" className="header text-right">
				{this.props.children}%
			</Col>
		);
	}
}
