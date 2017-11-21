import React from 'react';
import {Col} from 'reactstrap';

export default class ContentContainer extends React.Component {
	render() {
		return (
			<div className="outer-container">
				<Col lg={this.props.size} className="no-gutter aquarium-content-container">
					{this.props.children}
				</Col>
			</div>
		);
	}
}
