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
import Translate from 'translate-components';
import PickLanguage from '../base/PickLanguage';

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
			<Navbar light expand="md" className="fixed-top">
				<NavbarBrand><img src="/images/logo.png" alt="Logo" className="logo"/></NavbarBrand>
				<NavbarToggler className="test" onClick={this.toggle}/>
				<Collapse isOpen={this.state.isOpen} navbar>
					<Nav className="ml-auto" navbar>
						<NavItem>
							<NavLink href="" onClick={e => e.preventDefault()}><Translate>Analysis</Translate></NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="" onClick={e => e.preventDefault()}><Translate>Request Consult</Translate></NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="" onClick={e => e.preventDefault()}><Translate>Login</Translate></NavLink>
						</NavItem>
						<NavItem>
							<NavLink href="/myAquarium">My Aquarium (tmp)</NavLink>
						</NavItem>
						<Form>
							<FormGroup>
								<NavItem className="search-wrap">
									<span className="input-group searchBox-wrapper">
										<Input className="search-field" type="text" placeholder="Search..."/>
										<span className="input-group-btn searchBtn-wrap">
											<Button className="search-btn">
												<i className="fa fa-search"/>
											</Button>
										</span>
									</span>
								</NavItem>
							</FormGroup>
						</Form>
						<PickLanguage />
					</Nav>
				</Collapse>
			</Navbar>
		);
	}
}
