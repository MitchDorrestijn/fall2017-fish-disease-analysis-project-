import React from 'react';
import Sidebar from './Sidebar';
import SidebarLink from './SidebarLink';
import ContentContainer from './ContentContainer';

export default class MyAquarium extends React.Component {
	render () {
		// Cheap fix voor de newline in het kopje in de sidebar, misschien forceren met CSS?
		let title = <span>My<br/>Aquarium</span>;
		return (
			<div className="row row-no-gutter">
				<Sidebar size="3" title={title}>
					<SidebarLink first={true} img="/images/myAquarium/fishtank-icon.png" target="/myAquarium">
						My Fish
					</SidebarLink>
					<SidebarLink img="/images/myAquarium/graph-icon.png" target="/myAquarium">
						Today's data
					</SidebarLink>
					<SidebarLink img="/images/myAquarium/save-icon-wit.png" target="/myAquarium">
						Saved advices
					</SidebarLink>
					<SidebarLink img="/images/myAquarium/clock-icon.png" target="/myAquarium">
						Notifications
					</SidebarLink>
					<SidebarLink img="/images/myAquarium/profile-icon.png" target="/myAquarium">
						Account settings
					</SidebarLink>
				</Sidebar>
				<ContentContainer size="9" img="/images/myAquarium/achtergrond.jpg"/>
			</div>
		);
	}
}