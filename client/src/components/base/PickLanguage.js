import React from 'react';
import {Button} from 'reactstrap';
import { reactTranslateChangeLanguage } from 'translate-components';

export default class PickLanguage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    };
  }
  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
	setLanguage = (e) => {
		reactTranslateChangeLanguage(e);
		localStorage.setItem('language', e);
	}
  render() {
    return (
			<div>
				<ul className="flags">
					<li><Button onClick={(e) => this.setLanguage('en')} color="link"><img src={process.env.PUBLIC_URL + '/recources/flag-of-United-Kingdom.png'} alt="EN" /></Button></li>
					<li><Button onClick={(e) => this.setLanguage('nl')} color="link"><img src={process.env.PUBLIC_URL + '/recources/flag-of-Netherlands.png'} alt="EN" /></Button></li>
					<li><Button onClick={(e) => this.setLanguage('de')} color="link"><img src={process.env.PUBLIC_URL + '/recources/flag-of-Germany.png'} alt="EN" /></Button></li>
					<li><Button onClick={(e) => this.setLanguage('es')} color="link"><img src={process.env.PUBLIC_URL + '/recources/flag-of-Spain.png'} alt="EN" /></Button></li>
					<li><Button onClick={(e) => this.setLanguage('fy')} color="link"><img src={process.env.PUBLIC_URL + '/recources/flag-of-Fryslan.png'} alt="EN" /></Button></li>

					{/* <li><Button data-id='offline' onClick={reactTranslateChangeLanguage.bind(this, 'en')} color="link"><img src={process.env.PUBLIC_URL + '/recources/flag-of-United-Kingdom.png'} alt="EN" /></Button></li> */}
					{/* <li><Button onClick={reactTranslateChangeLanguage.bind(this, 'nl')} color="link"><img src={process.env.PUBLIC_URL + '/recources/flag-of-Netherlands.png'} alt="NL" /></Button></li>
					<li><Button onClick={reactTranslateChangeLanguage.bind(this, 'de')} color="link"><img src={process.env.PUBLIC_URL + '/recources/flag-of-Germany.png'} alt="GE" /></Button></li>
					<li><Button onClick={reactTranslateChangeLanguage.bind(this, 'es')} color="link"><img src={process.env.PUBLIC_URL + '/recources/flag-of-Spain.png'} alt="SP" /></Button></li>
					<li><Button onClick={reactTranslateChangeLanguage.bind(this, 'fy')} color="link"><img src={process.env.PUBLIC_URL + '/recources/flag-of-Fryslan.png'} alt="FR" /></Button></li> */}
				</ul>
			</div>
    );
  }
}
