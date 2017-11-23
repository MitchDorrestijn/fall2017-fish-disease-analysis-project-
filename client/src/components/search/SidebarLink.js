import React from 'react';
import {NavLink} from 'react-router-dom';

export default class SidebarLink extends React.Component {
	render() {
		return (
			<NavLink activeClassName="selected" to={this.props.target}>
				<img src={this.props.img} alt="icon"/>
				{this.props.children}
			</NavLink>
		);
	}
}
