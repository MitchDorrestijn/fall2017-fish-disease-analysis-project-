import React from 'react';
import {Route} from 'react-router-dom';
import Sidebar from './Sidebar';
import SidebarLink from './SidebarLink';
import ContentContainer from './ContentContainer';
import General from './General/General';
import Fish from './Fish/Fish';
import Diseases from './Diseases/Diseases';

export default class MyAquarium extends React.Component {
	render() {
		// Cheap fix voor de newline in het kopje in de sidebar, misschien forceren met CSS?
		let title = <span>My Search</span>;
		return (
				<div className="row row-no-gutter sidebar-wrap">
					<Sidebar size="3" title={title}>
						<SidebarLink img="/images/mySearch/globe-icon.png" target="/mySearch/General">
							General
						</SidebarLink>
						<SidebarLink img="/images/mySearch/fishtank-icon.png" target="/mySearch/Fish">
							Fish
						</SidebarLink>
						<SidebarLink img="/images/mySearch/plus-icon.png" target="/mySearch/Diseases">
							Diseases
						</SidebarLink>
					</Sidebar>
					<ContentContainer size="12" img="/images/myAquarium/achtergrond.jpg">
						<Route exact path="/mySearch/General" component={General}/>
						<Route exact path="/mySearch/Fish" component={Fish}/>
						<Route exact path="/mySearch/Diseases" component={Diseases}/>
					</ContentContainer>
				</div>
		);
	}
}
