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
			notifications: [],
			notificationsFromDB: []
		};
	}
	componentWillMount() {
		this.loadNotifications();
	}
	loadNotifications = () => {
		let da = new DataAccess();
		da.getData ('/notifications', (err, res) => {
			if (!err) {
				console.log (res.message);
				this.setState({notificationsFromDB: res.message});
				this.getNotifications();
			} else {
				console.log("De error is: " + err.message);
			}
		});
	}
	timeToString = (input) => {
		let date = new Date (input);
		let day = date.getDate ();
		let month = (date.getMonth () + 1).toString (10);
		let year = date.getFullYear ().toString (10);
		return `${day}-${month}-${year}`;
	};
	getNotifications = () => {
		let notifications = [];
		for(var key in this.state.notificationsFromDB) {
    	if(this.state.notificationsFromDB.hasOwnProperty(key)) {
				console.log(key);
				notifications.push(
					<Notification icon="danger-icon" date={this.timeToString(this.state.notificationsFromDB[key].date)} key={parseInt(key,10)} id={parseInt(key,10)} deleteNotification={this.deleteNotification}>
						<NotificationInfo title="The fish you added is not welcome in your aquarium.">
							{this.state.notificationsFromDB[key].message}
						</NotificationInfo>
						<NotificationData>
							Conflicting fish<br/>
							- Angel Fish<br/>
							- Betta
						</NotificationData>
					</Notification>
				);
    	}
		}
		this.setState({
			notifications: notifications
		})
	}
	deleteNotification = (key) => {
		let notifications = this.state.notifications;
		for (let i = 0; i < notifications.length; i++) {
			if (i === key) {
				notifications[i] = null;
			}
		}
		this.setState ({
			notifications: notifications
		});
	};
	render() {
		return (
			<div className="notifications">
				<h1 className="text-center">Notifications</h1>
				<Col lg={{size: 10, offset: 1}}>
					{this.state.notifications}
				</Col>
			</div>
		);
	}
}
