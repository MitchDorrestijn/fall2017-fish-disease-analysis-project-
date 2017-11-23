import React from 'react';
import {NavLink} from 'react-router-dom';

export default class SidebarLink extends React.Component {	
	render() {		
		return (
			<NavLink activeClassName="selected" to={this.props.target}>
				{
					this.props.tab ?
					<img style={{marginLeft: 70 + 'px'}} src={this.props.img} alt="icon"/> :
					<img src={this.props.img} alt="icon"/>
				}
				{this.props.children}
			</NavLink>
		);
	}
}
