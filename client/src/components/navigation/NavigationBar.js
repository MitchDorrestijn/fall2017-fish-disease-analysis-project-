import React from 'react';
import {
	Navbar,
	NavbarBrand,
	Nav,
	NavItem,
	NavbarToggler,
	Collapse,
	NavLink,
} from 'reactstrap';

export default class NavigationBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
		};
	}

	toggle = () => {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	};

	render() {
		return (
			<Navbar color="light" light expand="md" className="fixed-top">
				<NavbarBrand>Logo hier</NavbarBrand>
				<NavbarToggler onClick={this.toggle}/>
				<Collapse isOpen={this.state.isOpen} navbar>
					<Nav className="ml-auto" navbar>
						<NavItem>
							<NavLink href="" onClick={e => e.preventDefault()}>Analysis</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="" onClick={e => e.preventDefault()}>Request Consult</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="" onClick={e => e.preventDefault()}>Login</NavLink>
						</NavItem>
						<NavItem>
							{/* Hier komt een tekstveld! */}
						</NavItem>
					</Nav>
				</Collapse>
			</Navbar>
		);
	}
}
