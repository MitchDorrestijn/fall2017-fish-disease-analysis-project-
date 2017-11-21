import React from 'react';
import {Col} from 'reactstrap';

export default class Notification extends React.Component {
	render() {
		return (
			<Col lg="3" className="no-gutter">
				<div className="data">
					<p>{this.props.children}</p>
				</div>
			</Col>
		);
	}
}
