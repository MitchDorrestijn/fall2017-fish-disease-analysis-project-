import React from 'react';
import {Link} from 'react-router-dom';

export default class SidebarLink extends React.Component {
	render() {
		// Eerste link heeft een border-top nodig
		let firstClassName;
		if (this.props.first) {
			firstClassName = 'first';
		}
		return (
			<Link to={this.props.target} className={firstClassName} onClick={e => e.preventDefault()}>
				<img src={this.props.img} alt="icon"/>
				{this.props.children}
			</Link>
		);
	}
}