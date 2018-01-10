import React from 'react';
import Notification from './Notification';
import NotificationInfo from './NotificationInfo';
import NotificationData from './NotificationData';
import {Col} from 'reactstrap';
import DataAccess from '../../../scripts/DataAccess';

export default class Notifications extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notificationsRead: [],
			notificationsUnread: [],
			notificationsFromDB: []
		};
	};
	componentWillMount() {
		this.loadNotifications();
	};
	loadNotifications = () => {
		let da = new DataAccess();
		da.getData ('/notifications', (err, res) => {
			if (!err) {
				console.log (res.message);
				this.setState({notificationsFromDB: res.message});
				this.getNotifications();
			} else {
				console.log("De error is: " + err.message);
			};
		});
	};
	timeToString = (input) => {
		let date = new Date (input);
		let day = date.getDate ();
		let month = (date.getMonth () + 1).toString (10);
		let year = date.getFullYear ().toString (10);
		return `${day}-${month}-${year}`;
	};
	checkNotificationType = (type) => {
		if (type === 'Urgent') {
			return "danger-icon";
		} else {
			return "warning-icon";
		};
	};
	getNotifications = () => {
		let notificationsRead = [];
		let notificationsUnread = [];
		for (var key in this.state.notificationsFromDB) {
    	if (this.state.notificationsFromDB.hasOwnProperty (key)) {
				if (this.state.notificationsFromDB[key].isRead) {
					notificationsRead.push(
						<Notification icon={this.checkNotificationType (this.state.notificationsFromDB[key].type)} key={parseInt (key,10)} id={parseInt (key,10)} deleteNotification={this.deleteNotification}>
							<NotificationInfo>
								{this.state.notificationsFromDB[key].message}
							</NotificationInfo>
							<NotificationData>
								{this.timeToString(this.state.notificationsFromDB[key].date)}
							</NotificationData>
						</Notification>
					);
				} else {
					notificationsUnread.push(
						<Notification icon={this.checkNotificationType (this.state.notificationsFromDB[key].type)} key={parseInt (key,10)} id={parseInt (key,10)} deleteNotification={this.deleteNotification}>
							<NotificationInfo>
								{this.state.notificationsFromDB[key].message}
							</NotificationInfo>
							<NotificationData>
								{this.timeToString(this.state.notificationsFromDB[key].date)}
							</NotificationData>
						</Notification>
					);
				};
    	};
		};
		this.setState({
			notificationsRead: notificationsRead
		});
		this.setState({
			notificationsUnread: notificationsUnread
		});
	};
	// deleteNotification = (key) => {
	// 	let notifications = this.state.notificationsRead;
	// 	for (let i = 0; i < notifications.length; i++) {
	// 		if (i === key) {
	// 			notifications[i] = null;
	// 		}
	// 	}
	// 	this.setState ({
	// 		notificationsRead: notifications
	// 	});
	// };
	render() {
		return (
			<div className="notifications">
				<h1 className="text-center">New notifications</h1>
				<Col lg={{size: 10, offset: 1}}>
					{this.state.notificationsUnread}
				</Col>
				<h1 className="text-center">Old notifications</h1>
				<Col lg={{size: 10, offset: 1}}>
					{this.state.notificationsRead}
				</Col>
			</div>
		);
	};
};
