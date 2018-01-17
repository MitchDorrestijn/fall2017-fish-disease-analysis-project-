import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class AdvicePicture extends Component {
	render() {
		return (
			<Col lg="3" xs="12" className="no-gutter">
				<div className="image-container">
					<div className="image">
						{ /* Dit zal waarschijnlijk een ander pad worden */ }
						<img src={this.props.src} alt="icon"/><br/>
					</div>
				</div>
			</Col>
		);
	}
}
