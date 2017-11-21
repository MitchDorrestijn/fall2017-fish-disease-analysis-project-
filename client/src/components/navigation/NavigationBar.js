import React from 'react';
import {
	Navbar,
	Nav,
	NavItem,
	NavbarToggler,
	Collapse,
	Input,
	Button,
	Form,
	FormGroup
} from 'reactstrap';
import {Link} from 'react-router-dom';
import Translate from 'translate-components';
import PickLanguage from '../base/PickLanguage';
import Login from '../modal/Login';

export default class NavigationBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
		};
	}

	showLogin = (evt) => {
		evt.preventDefault ();
		this.props.openModal(Login);
	};

	toggle = () => {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	};

	render() {
		return (
			<Navbar light expand="md" className="fixed-top">
				<Link to="/" className="nav-link"><img src="/images/logo.png" alt="Logo" className="logo"/></Link>
				<NavbarToggler className="test" onClick={this.toggle}/>
				<Collapse isOpen={this.state.isOpen} navbar>
					<Nav className="ml-auto" navbar>
						<NavItem>
							<Link className="nav-link" to="" onClick={e => e.preventDefault()}><Translate>Analysis</Translate></Link>
						</NavItem>
						<NavItem>
							<Link className="nav-link" to="" onClick={e => e.preventDefault()}><Translate>Request Consult</Translate></Link>
						</NavItem>
						<NavItem>
							<Link className="nav-link" to="" onClick={this.showLogin}><Translate>Login</Translate></Link>
						</NavItem>
						<NavItem>
							<Link className="nav-link" to="/myAquarium">My Aquarium (tmp)</Link>
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
