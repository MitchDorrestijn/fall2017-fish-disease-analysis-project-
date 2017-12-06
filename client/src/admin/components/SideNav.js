import React from 'react';
import {Route} from 'react-router-dom';
import Sidebar from '../../components/myAquarium/Sidebar';
import SidebarLink from '../../components/myAquarium/SidebarLink';
import ContentContainer from '../../components/myAquarium/ContentContainer';
import ManageAgenda from './ManageAgenda';
import ManageDesises from './ManageDesises';
import ManageFish from './ManageFish';
import ManageNotifications from './ManageNotifications';
import ManageUsers from './ManageUsers';
import Logout from './Logout';

export default class SideNav extends React.Component {
	render() {
		return (
				<div className="row row-no-gutter sidebar-wrap">
					<Sidebar size="3" title="Admin" extraClass="adminSidebar">
						<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/vissen">Species</SidebarLink>
						<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/ziektes">Diseases</SidebarLink>
						<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/afspraken">Appointments</SidebarLink>
						<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/notificaties">Notifications</SidebarLink>
						<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/gebruikers">Users</SidebarLink>
						<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/uitloggen">Log out</SidebarLink>
					</Sidebar>
					<ContentContainer extraClass="adminContentContainer" size="12">
						<Route exact path="/admin/vissen" render={(props) => {
							return <ManageFish {...props} openModal={this.props.openModal} />
						}}/>
						<Route exact path="/admin/ziektes" render={(props) => {
							return <ManageDesises {...props} openModal={this.props.openModal} />
						}}/>
						<Route exact path="/admin/afspraken" component={ManageAgenda}/>
						<Route exact path="/admin/notificaties" component={ManageNotifications}/>
						<Route exact path="/admin/gebruikers" component={ManageUsers}/>
						<Route exact path="/admin/uitloggen" component={Logout}/>
					</ContentContainer>
				</div>
		);
	}
}
