import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import Sidebar from '../../components/myAquarium/Sidebar';
import SidebarLink from '../../components/myAquarium/SidebarLink';
import ContentContainer from '../../components/myAquarium/ContentContainer';
import ManageAgenda from './ManageAgenda/ManageAgenda';
import ManageFish from './ManageFish';
import ManageNotifications from './ManageNotifications/ManageNotifications';
import ManageTimeSlots from './ManageTimeSlots/ManageTimeSlots';
import ManageAnalyse from './ManageAnalyse/ManageAnalyse';
import ManageDesises from './ManageDesises';

export default class SideNav extends React.Component {
	render() {
		return (
			<div className="row row-no-gutter sidebar-wrap">
				<Sidebar size="3" title={<span>Control<br/>Panel</span>} extraClass="adminSidebar">
					<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/fish">Fish</SidebarLink>
					<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/diseases">Diseases</SidebarLink>
					<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/appointments">Appointments</SidebarLink>
					<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/timeslots">Timeslots</SidebarLink>
					<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/notifications">Notifications</SidebarLink>
					<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/analyse">Analyse</SidebarLink>
					<SidebarLink img="/images/myAquarium/fishtank-icon.png" target="/admin/exit">Exit</SidebarLink>
				</Sidebar>
				<ContentContainer extraClass="adminContentContainer" size="12">
					<Route exact path="/admin/fish" render={(props) => {
						return <ManageFish {...props} openModal={this.props.openModal} />
					}}/>
					<Route exact path="/admin/diseases" render={(props) => {
						return <ManageDesises {...props} openModal={this.props.openModal} />
					}}/>
					<Route exact path="/admin/appointments" render={(props) => {
						return <ManageAgenda {...props} openModal={this.props.openModal} />
					}}/>
					<Route exact path="/admin/timeslots" render={(props) => {
						return <ManageTimeSlots {...props} openModal={this.props.openModal} />
					}}/>
					<Route exact path="/admin/notifications" render={(props) => {
						return <ManageNotifications {...props} openModal={this.props.openModal} />
					}}/>
					<Route exact path="/admin/analyse" component={ManageAnalyse}/>
					<Route exact path="/admin/exit" render={() => <Redirect to="/"/>}/>
				</ContentContainer>
			</div>
		);
	}
}
