import React from 'react';
import Notification from './Notification';
import {Col} from 'reactstrap';

export default class Notifications extends React.Component {
	render() {
		return (
			<div className="notifications">
				<h1 className="text-center">Notifications</h1>
				<Col lg={{size: 10, offset: 1}}>
					<Notification/>
					<Notification/>
				</Col>
			</div>
		);
	}
}