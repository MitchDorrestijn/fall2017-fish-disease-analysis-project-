import React, {Component} from 'react';
import {Col} from 'reactstrap';

export default class DiseasePicture extends Component {

	componentDidMount(){
		if(this.props.symptoms){
			let listEl = document.getElementById("symptomsList");
			for(let i = 0; i < this.props.symptoms.length; i++){
				listEl.innerHTML += "<li>" + this.props.symptoms[i] + "</li>";
			}
			document.getElementById("symptomsList").id = "";
		}
	}

	render() {
		return (
			<Col lg="2" xs="12" className="no-gutter">
				<div className="data">
					<ul id="symptomsList">
					</ul>
				</div>
			</Col>
		);
	}
}
