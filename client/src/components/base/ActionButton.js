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
	onClickAction = (props) => {
		if(this.props.link){
	    this.setState ({redirect: <Redirect to={this.props.linkTo} />});
		} else {
			console.log('Hier kan een functie komen.');
		}
	}
	render(){
		return(
			<div>
				<Button outline color={this.props.color} onClick={this.onClickAction}>{this.props.buttonText}</Button>
				{this.state.redirect}
			</div>
		);
	}
}
