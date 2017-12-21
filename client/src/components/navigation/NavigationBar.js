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
			error: null
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

	search = (e) => {
		e.preventDefault();
		const searchText = document.getElementById("search").value;

		if(searchText){
			if(!searchText){
				window.location.href = "/search";
			}else{
				window.location.href = "/search/" + searchText;
			}
		} else {
			this.setState({error: 'Please fill in a search term.'})
		}
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
						{
							this.props.loggedIn ?
							([
								<NavItem key={0}><Link className="nav-link" to="/myAquarium">My Aquarium</Link></NavItem>,
								(this.props.isAdmin ?
									<NavItem key={1}><Link className="nav-link" to="/admin">Admin</Link></NavItem> :
									null
								),
								<NavItem key={2}><Link className="nav-link" to="" onClick={this.props.logOut}><Translate>Logout</Translate></Link></NavItem>
							])
							:
							(
								<NavItem><Link className="nav-link" to="" onClick={this.showLogin}><Translate>Login</Translate></Link></NavItem>
							)
						}
						<Form onSubmit={(e) => this.search(e)}>
							<FormGroup>
								<NavItem className="search-wrap">
									<span className="input-group searchBox-wrapper">
										<Input className="search-field" id="search" type="text" placeholder="Search..."/>
										<span className="input-group-btn searchBtn-wrap">
											<Button className="search-btn" onClick={(e) => this.search(e)}>
												<i className="fa fa-search"/>
											</Button>
										</span>
									</span>
									<small className="searchError">{this.state.error}</small>
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
