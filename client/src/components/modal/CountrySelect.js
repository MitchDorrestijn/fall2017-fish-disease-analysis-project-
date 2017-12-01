import React from 'react';
import countries from '../../data/countries.js'

import {
	Input
} from 'reactstrap';

class CountrySelect extends React.Component {
	getCountries() {
		return countries.map((country) => {
			return <option value={country.code}>{country.name}</option>
		});
	}

	render() {
		return (
			<Input className={this.props.classStyle} value={this.props.country} onChange={this.props.function} type="select" name="select" id="country">
				<option value="" disabled selected hidden>Please Choose...</option>
				{this.getCountries()}
			</Input>
		);
	}
}

export default CountrySelect;