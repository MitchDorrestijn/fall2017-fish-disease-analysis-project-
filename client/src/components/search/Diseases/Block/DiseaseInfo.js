import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class DiseaseInfo extends Component {
	render() {
		return (
			<Col lg="7" xs="12" className="no-gutter">
				<div className="info">
					<p>
						<img className="searchResultIcon" title="Disease" src="/images/search/plus-icon.png" alt="icon"/> <strong>{this.props.title}</strong><br/>
						{this.props.info}
					</p>
				</div>
			</Col>
		);
	}
}
