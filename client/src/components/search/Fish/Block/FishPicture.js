import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class AdvicePicture extends Component {
	render() {
		return (
			<Col lg="3" className="no-gutter">
				<div className="image-container">
					<div className="image">
						<img src={`/images/fish/${this.props.src}`} alt="icon"/><br/>
					</div>
				</div>
			</Col>
		);
	}
}