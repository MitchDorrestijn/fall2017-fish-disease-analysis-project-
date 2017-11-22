import React from 'react';
import {Col} from 'reactstrap';

export default class Sidebar extends React.Component {
	render() {
		return (
			<Col lg={this.props.size} className="no-gutter">
				<div className="search-sidebar col-lg-3 no-gutter">
					<h2>{this.props.title}</h2>
					{this.props.children}
					{/* <div className="arrow-right"/> */}
				</div>
			</Col>
		);
	}
}
