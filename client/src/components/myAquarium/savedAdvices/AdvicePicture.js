import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class AdvicePicture extends Component {
	render() {
		return (
			<Col xs="12" lg="3" className="no-gutter">
				<div className="image-container">
					<div className="image">
						{ /* Dit zal waarschijnlijk een ander pad worden */ }
						<img src={`/images/myAquarium/savedAdvices/${this.props.src}.jpg`} alt="icon"/><br/>
					</div>
				</div>
			</Col>
		);
	}
}
