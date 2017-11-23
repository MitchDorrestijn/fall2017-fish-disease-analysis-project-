import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class LeesMeer extends Component {
	render() {
		return (
			<Col lg="12" className="header">
				{this.props.children}
			</Col>
		);
	}
}
