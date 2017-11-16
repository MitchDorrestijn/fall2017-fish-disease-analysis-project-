import React from 'react';
import Notification from './Notification';
import NotificationInfo from './NotificationInfo';
import NotificationData from './NotificationData';
import {Col} from 'reactstrap';

export default class Notifications extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notifications: []
		};
	}

	componentWillMount() {
		this.getNotifications();
	}

	getNotifications = () => {
		// Deze notificaties zouden uit de database moeten komen en vervolgens hier geparsed moeten worden.
		// Er wordt verwacht dat er een for loop gebruikt wordt, hierbij moeten "key" en "id" allebei de iterator van de loop zijn
		let notifications = [
			<Notification icon="danger-icon" date="20-11-2017" key={0} id={0} deleteNotification={this.deleteNotification}>
				<NotificationInfo title="The fish you added is not welcome in your aquarium.">
					Angels and bettas are both notorious fin nippers,
					and if you end up with angel fish that decide to
					pair up, it will probably end up pretty ugly for the
					betta.
				</NotificationInfo>
				<NotificationData>
					Conflicting fish<br/>
					- Angel Fish<br/>
					- Betta
				</NotificationData>
			</Notification>,
			<Notification icon="warning-icon" date="19-11-2017" key={1} id={1} deleteNotification={this.deleteNotification}>
				<NotificationInfo title="Your water 6.4 pH is not optimal.">
					Please check your aquarium water to make sure your fish has the optimal living environtment.
					Adding baking soda will raise the pH, but remember that this will need to be constantly added.
				</NotificationInfo>
				<NotificationData>
					Water pH<br/>
					- Currently 6.4 pH<br/>
					- Optimal 8.5 pH
				</NotificationData>
			</Notification>,
			<Notification icon="fish-icon-blue" date="18-11-2017" key={2} id={2} deleteNotification={this.deleteNotification}>
				<NotificationInfo title="New fish added to aquarium">
					You have recently added a bluespotted corydoras in aquarium #1, you now have three bluespotted corydoras in total.
				</NotificationInfo>
				<NotificationData>
					New fish<br/>
					- Bluespotted corydoras<br/>
					- Three bluespotted corydoras in total
				</NotificationData>
			</Notification>,
			<Notification icon="fish-icon-removedfish" date="17-11-2017" key={3} id={3} deleteNotification={this.deleteNotification}>
				<NotificationInfo title="Fish removed from aquarium #2 ">
					You have recently removed one bluespotted corydoras in aquarium #2.
				</NotificationInfo>
				<NotificationData>
					Removed fish<br/>
					- Bluespotted corydoras<br/>
					- Two bluespotted corydoras left.
				</NotificationData>
			</Notification>,
		];
		this.setState ({
			notifications: notifications
		});
	};

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