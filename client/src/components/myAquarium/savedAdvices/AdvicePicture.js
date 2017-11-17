import React, {Component} from 'react';

export default class AdvicePicture extends Component {
	render() {
		return (
			<Col lg="2" className="no-gutter">
				<div className="image-container">
					<div className="image">
						{ /* Dit zal waarschijnlijk een ander pad worden */ }
						<img src={`/images/myAquarium/savedAdvices/${this.props.icon}.png`} alt="icon"/><br/>
					</div>
				</div>
			</Col>
		);
	}
}