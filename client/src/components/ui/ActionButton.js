import React from 'react';
import {Button} from 'reactstrap';
import {Redirect} from 'react-router-dom';

export default class ActionButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			redirect: null
		}
	}

	onClickAction = () => {
		if (this.props.linkTo){
	        this.setState ({redirect: <Redirect to={this.props.linkTo} />});
		} else if (this.props.onClickAction) {
			this.props.onClickAction();
		}
	};

	render(){
		return(
			<div>
				<Button outline color={this.props.color} onClick={this.onClickAction}>{this.props.buttonText}</Button>
				{this.state.redirect}
			</div>
		);
	}
}
