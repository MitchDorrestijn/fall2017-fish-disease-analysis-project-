import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class AdvicePicture extends Component {
	render() {
		return (
			<Col lg="2" className="no-gutter">
				<div className="data">
					<p>
						<ul>
							{this.props.children}
						</ul>
					</p>
				</div>
			</Col>
		);
	}
}
