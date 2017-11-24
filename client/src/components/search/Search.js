import React from 'react';
import {Route} from 'react-router-dom';
import Sidebar from './Sidebar';
import SidebarLink from './SidebarLink';
import ContentContainer from './ContentContainer';
import All from './All/All';
import Fish from './Fish/Fish';
import Diseases from './Diseases/Diseases';

export default class MyAquarium extends React.Component {
	render() {
		// Cheap fix voor de newline in het kopje in de sidebar, misschien forceren met CSS?
		let title = <span>Search results</span>;
		let search = window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1);
		if(search === "search" || search === "Fish" || search === "Diseases"){
				search = "";
		}
		return (
				<div className="row row-no-gutter sidebar-wrap">
					<Sidebar size="3" title={title}>
						<SidebarLink tab={false} img="/images/search/search-icon.png" target={"/search/" + search}>
							All results
						</SidebarLink>
						<SidebarLink tab={true} img="/images/search/fishtank-icon.png" target={"/search/Fish/" + search}>
							Fish
						</SidebarLink>
						<SidebarLink tab={true} img="/images/search/plus-icon.png" target={"/search/Diseases/" + search}>
							Diseases
						</SidebarLink>
					</Sidebar>
					<ContentContainer size="12" img="/images/myAquarium/achtergrond.jpg">
						<Route exact path="/search" render={(props) => {
							return <All {...props} searchTerm={search}/>
						}}/>
						<Route exact path="/search/:searchTerms" render={(props) => {
							return <All {...props} searchTerm={search}/>
						}}/>
						<Route exact path="/search/Fish/:searchTerms" render={(props) => {
							return <Fish {...props} searchTerm={search}/>
						}}/>
						<Route exact path="/search/Diseases/:searchTerms" render={(props) => {
							return <Diseases {...props} searchTerm={search}/>
						}}/>
					</ContentContainer>
				</div>
		);
	}
}
