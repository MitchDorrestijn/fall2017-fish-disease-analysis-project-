import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class DiseasePicture extends Component {
	render() {
		return (
			<Col lg="3" xs="12" className="no-gutter">
				<div className="image-container">
					<div className="image">
						{
							this.props.src ?
								(<img className="resultPicture" src={this.props.src} alt="icon"/>)
							:
								(<p>No image</p>)
						}
					<br/>
					</div>
				</div>
			</Col>
		);
	}
}
