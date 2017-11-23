import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class AdviceInfo extends Component {
	render() {
		return (
			<Col lg="7" className="no-gutter">
				<div className="info">
					<p><strong>{this.props.title}</strong><br/>
						{this.props.info}
					</p>
				</div>
			</Col>
		);
	}
}
