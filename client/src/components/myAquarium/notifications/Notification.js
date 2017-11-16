import React from 'react';
import {Col, Row} from 'reactstrap';

export default class Notification extends React.Component {
	render() {
		return (
			<Row className="notification">
				<Col lg="2" className="no-gutter">
					<div className="icon-container">
						<div className="icon">
							<img src="/images/myAquarium/notifications/danger-icon.png" alt="icon"/><br/>
							15-11-2017
						</div>
					</div>
				</Col>
				<Col lg="7" className="no-gutter">
					<div className="info">
						<strong>The fish you added is not welcome in your aquarium.</strong><br/>
						Angels and bettas are both notorious fin nippers, and if you end up with angel fish that decide to pair up, it will probably end up pretty ugly for the betta.
					</div>
				</Col>
				<Col lg="3" className="no-gutter">
					<div className="data">
						Conflicting fish<br/>
						- Angel Fish<br/>
						- Betta
						<div className="close text-right">
							<a href="" onClick={e => e.preventDefault()}><span className="fa fa-close"/></a>
						</div>
					</div>
				</Col>
			</Row>
		);
	}
}