import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class FishAdditional extends Component {
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
					<h4>Additional information</h4>
					{this.props.additional}
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
					<span className={this.getArrowClass()}/>
				</a>
				{this.getContent()}
			</Col>
		);
	}
}
