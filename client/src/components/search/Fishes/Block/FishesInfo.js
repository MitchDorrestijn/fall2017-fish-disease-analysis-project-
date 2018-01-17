import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class FishesInfo extends Component {
	render() {
		return (
			<Col lg="9" xs="12" className="no-gutter">
				<div className="info">
					<p><img className="searchResultIcon" title="Fish" src="/images/search/fishtank-icon.png" alt="icon"/> <strong>{this.props.title}</strong><br/>
						{this.props.info}
					</p>
				</div>
			</Col>
		);
	}
}
