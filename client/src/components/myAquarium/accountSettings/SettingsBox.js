import React from 'react';
import {Col, Row} from 'reactstrap';

export default class SettingsBox extends React.Component{
	render() {
		return (
			<div className="settings-box">
				<Col sm="12">
					<h4>{this.props.title}</h4>
				</Col>
				<Row>
					{this.props.children}
				</Row>
			</div>
		);
	}
}