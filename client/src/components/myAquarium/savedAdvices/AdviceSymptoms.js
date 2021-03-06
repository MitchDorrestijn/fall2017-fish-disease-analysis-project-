import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class AdvicePicture extends Component {
	render() {
		return (
			<Col xs="12" lg="2" className="no-gutter">
				<div className="data">
					<ul>
						{this.props.children}
					</ul>
				</div>
			</Col>
		);
	}
}
