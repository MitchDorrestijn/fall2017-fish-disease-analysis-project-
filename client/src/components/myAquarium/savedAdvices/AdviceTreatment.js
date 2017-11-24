import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class AdviceTreatment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false
		};
	}

	toggleTreatment = (evt) => {
		evt.preventDefault();
		this.setState({
			isOpen: !this.state.isOpen
		});
	};

	getArrowClass = () => {
		if (this.state.isOpen) {
			return "fa fa-arrow-up";
		} else {
			return "fa fa-arrow-down";
		}
	};

	getDropdownText = () => {
		if (this.state.isOpen) {
			return "Read less";
		} else {
			return "Read more";
		}
	};

	getColClass = () => {
		if (this.state.isOpen) {
			return "text-center white-bg"
		} else {
			return "text-center no-bg"
		}
	};

	getLinkClass = () => {
		if (this.state.isOpen) {
			return "dropdown-link-up"
		} else {
			return "dropdown-link-down"
		}
	};

	getContent = () => {
		if (this.state.isOpen) {
			return (
				<div className="treatment-container">
					<h4>Method of treatment</h4>
					{this.props.children}
				</div>
			);
		} else {
			return null;
		}
	};

	render() {
		return (
			<Col lg="12" className={this.getColClass()}>
				<a href="" onClick={this.toggleTreatment} className={this.getLinkClass()}>
					{this.getDropdownText()}<br/>
					<span className={this.getArrowClass()}/>
				</a>
				{this.getContent()}
			</Col>
		);
	}
}