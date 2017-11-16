import React from 'react';
import {Col} from 'reactstrap';

export default class Notification extends React.Component {
	render() {
		return (
			<Col lg="2" className="no-gutter">
				<div className="icon-container">
					<div className="icon">
						<img src={`/images/myAquarium/notifications/${this.props.icon}.png`} alt="icon"/><br/>
						{this.props.date}
					</div>
				</div>
			</Col>
		);
	}
}
