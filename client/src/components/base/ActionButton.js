import React from 'react';
import {Button} from 'reactstrap';
import {Redirect} from 'react-router-dom';

export default class ActionButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		  	disabled: false,
			redirect: null
		}
	}

	onClickAction = () => {
	  	// Setting the button on disabled for a second, so client side won't send to many ajax requests. Not a very elegant solution
	  	this.setState({disabled: true});
	  	setTimeout(() => {
		  this.setState({disabled: false});
		},1000);

		if (this.props.linkTo){
	        this.setState ({redirect: <Redirect to={this.props.linkTo} />});
		} else if (this.props.onClickAction) {
			this.props.onClickAction();
		}
	};

	render(){
		return(
			<div>
				<Button disabled={this.state.disabled} id={this.props.id} outline color={this.props.color} onClick={this.onClickAction}>{this.props.buttonText}</Button>
				{this.state.redirect}
			</div>
		);
	}
}
