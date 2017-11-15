import React from 'react';
import {
	Navbar,
	NavbarBrand,
	Nav,
	NavItem,
	NavbarToggler,
	Collapse,
	NavLink,
	Input,
	Button,
	Form,
	FormGroup
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
			<Navbar style={{height: '80px', paddingTop: '20px'}} light expand="md" className="fixed-top">
				<NavbarBrand><img src="/images/logo.png" alt="Logo" className="logo"/></NavbarBrand>
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
						<Form>
							<FormGroup>
								<NavItem>
									<span className="input-group">
										<Input type="text" placeholder="Search..."/>
										<span className="input-group-btn">
											<Button>
												<i className="fa fa-search"/>
											</Button>
										</span>
									</span>
								</NavItem>
							</FormGroup>
						</Form>
					</Nav>
				</Collapse>
			</Navbar>
		);
	}
}
