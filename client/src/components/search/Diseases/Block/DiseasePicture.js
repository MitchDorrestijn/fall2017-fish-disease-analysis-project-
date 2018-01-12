import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class AdvicePicture extends Component {
	render() {
		return (
			<Col lg="3" xs="12" className="no-gutter">
				<div className="image-container">
					<div className="image">
						<img className="resultPicture" src={`/images/myAquarium/savedAdvices/${this.props.src}.jpg`} alt="icon"/><br/>
					</div>
				</div>
			</Col>
		);
	}
}
