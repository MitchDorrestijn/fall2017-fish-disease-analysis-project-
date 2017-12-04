import React from 'react';
import {Route} from 'react-router-dom';
import Sidebar from './Sidebar';
import SidebarLink from './SidebarLink';
import ContentContainer from './ContentContainer';
import MyFish from './myFish/MyFish';
import TodaysData from './todaysData/TodaysData';
import SavedAdvices from './savedAdvices/SavedAdvices';
import Notifications from './notifications/Notifications';
import AccountSettings from './accountSettings/AccountSettings';
import RequestConsult from './requestConsult/RequestConsult';

export default class MyAquarium extends React.Component {
	render() {
		// Cheap fix voor de newline in het kopje in de sidebar, misschien forceren met CSS?
		let title = <span>My<br/>Aquarium</span>;
		return (
				<div className="row row-no-gutter sidebar-wrap">
					<Sidebar size="3" title={title}>
						<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/myAquarium/myFish">
							My Fish
						</SidebarLink>
						<SidebarLink img="/images/myAquarium/graph-icon.png" target="/myAquarium/todaysData">
							Today's data
						</SidebarLink>
						<SidebarLink img="/images/myAquarium/save-icon-wit.png" target="/myAquarium/savedAdvices">
							Saved advices
						</SidebarLink>
						<SidebarLink img="/images/myAquarium/clock-icon.png" target="/myAquarium/notifications">
							Notifications
						</SidebarLink>
						<SidebarLink img="/images/myAquarium/calendar-icon.png" target="/myAquarium/requestConsult">
							Register a consult
						</SidebarLink>
						<SidebarLink img="/images/myAquarium/profile-icon.png" target="/myAquarium/accountSettings">
							Account settings
						</SidebarLink>
					</Sidebar>
					<ContentContainer size="12" img="/images/myAquarium/achtergrond.jpg">
						<Route exact path="/myAquarium/myFish" render={(props) => {
							return <MyFish {...props} openModal={this.props.openModal}/>
						}}/>
						<Route exact path="/myAquarium/todaysData" render={(props) => {
							return <TodaysData {...props} openModal={this.props.openModal}/>
						}}/>
						<Route exact path="/myAquarium/savedAdvices" component={SavedAdvices}/>
						<Route exact path="/myAquarium/notifications" component={Notifications}/>
						<Route exact path="/myAquarium/accountSettings" component={AccountSettings}/>
						<Route exact path="/myAquarium/requestConsult" component={RequestConsult}/>
					</ContentContainer>
				</div>
		);
	}
}
