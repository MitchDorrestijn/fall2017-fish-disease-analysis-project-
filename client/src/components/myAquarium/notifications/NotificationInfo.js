import React from 'react';
import {Col} from 'reactstrap';

export default class Notification extends React.Component {
	render() {
		return (
			<Col lg="7" className="no-gutter">
				<div className="info">
					<p>
						{this.props.children}
					</p>
				</div>
			</Col>
		);
	}
}
