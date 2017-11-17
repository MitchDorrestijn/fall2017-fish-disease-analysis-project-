import React from 'react';
import {Row} from 'reactstrap';
import NotificationIcon from './NotificationIcon';

export default class Notification extends React.Component {
	deleteNotification = (evt) => {
		evt.preventDefault();
		this.props.deleteNotification(this.props.id);
	};

	render() {
		return (
			<Row className="notification">
				<NotificationIcon icon={this.props.icon} date={this.props.date}/>
				{this.props.children}
				<div className="close-container">
					<div className="close text-right">
						<a href="" onClick={this.deleteNotification}><span className="fa fa-close"/></a>
					</div>
				</div>
			</Row>
		);
	}
}