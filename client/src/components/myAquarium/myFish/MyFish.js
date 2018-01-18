import React from 'react';
import Card from '../../base/Card';
import {CardText, CardTitle, CardSubtitle} from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import {Link} from 'react-router-dom';
import AddFish from '../../modal/AddFish';
import AddAquarium from '../../modal/AddAquarium';
import RemoveAquarium from '../../modal/RemoveAquarium';
import RemoveFish from '../../modal/RemoveFish';
import DataAccess from '../../../scripts/DataAccess';

export default class MyFish extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			fishData: [],
			createdAquariums: "",
			currentAquarium: "",
			currentAquariumId: "",
			showCRUDbtns: false
		}
		this.baseState = this.state;
	}
	componentWillMount(){
		this.renderAquariums();
	}
	renderAquariums = () => {
		let da = new DataAccess();
		da.getData ('/aquaria', (err, res) => {
			if (!err) {
				this.setState({createdAquariums: res.message});
			} else {
				console.log("De error is: " + err.message);
			}
		});
	}
	createFilterButtons = () => {
		let buttons = [];
		for(var key in this.state.createdAquariums) {
    	if(this.state.createdAquariums.hasOwnProperty(key)) {
				let {id, name} = this.state.createdAquariums[key];
				buttons.push(
					<ActionButton
						key={key}
						color="primary btn-transparent"
						buttonText={name}
						onClickAction={() => this.showSelectedCategory(id)}
						id={id}
					/>
				);
			}
		}
		return (
			<div className="btn-wrapper">
				{buttons}
			</div>
		)
	}

	showSelectedCategory = (aquariumName) => {
		for(let i=0; i<this.state.createdAquariums.length; i++){
			document.getElementById(this.state.createdAquariums[i].id).classList.remove("focus");
		}
		document.getElementById(aquariumName).className += " focus";

		let da = new DataAccess();
		da.getData(`/aquaria/${aquariumName}/fish`,  (err, res) => {
			if (!err) {
				this.setState({ currentAquarium: res.message, currentAquariumId: aquariumName, showCRUDbtns: true });
			}
		});
  }
	objectLength = (obj) => {
	  let result = 0;
	  for(let prop in obj) {
	    if (obj.hasOwnProperty(prop)) {
	      result++;
	    }
	  }
	  return result;
	}
	removeFish = (e, fid, fname) => {
		e.preventDefault();
		this.props.openModal(RemoveFish, {refreshPage: () => this.showSelectedCategory (this.state.currentAquariumId), currentAquarium: this.state.currentAquariumId, fishId: fid, fishName: fname});
	}
	filterFish = () => {
		let amountOfFishInAqauria = this.objectLength(this.state.currentAquarium.fish);
		if(amountOfFishInAqauria > 0){
			if (this.state.currentAquarium) {
				const {fish} = this.state.currentAquarium;
				const result = fish.map ((elem) => {
					return (
						<Card key={elem.id} image={elem.species.imageUrl} onRemove={(e) => this.removeFish(e, elem.species.id, elem.species.name)}>
							<CardTitle>{elem.species.name}</CardTitle>
							<CardSubtitle>{elem.species.additional}</CardSubtitle>
							<CardText>{elem.species.info}</CardText>
						</Card>
					);
				});
				return result;
			} else {
				return null;
			}
		} else {
			if(this.state.currentAquarium !== ""){
				return <p><span className="inline-text">You did not add any fish here, why don't you</span><a className="inline-btn" onClick={this.showAddFishModel} color="link">add one</a></p>
			} else {
				return <p>Please select an aquarium.</p>;
			}
		}
	}
	showAddFishModel = (e) => {
		e.preventDefault ();
		this.props.openModal(AddFish, {refreshPage: () => this.showSelectedCategory (this.state.currentAquariumId), currentAquarium: this.state.currentAquariumId, fishInAquaria: this.state.currentAquarium});
	};
	showAddAquariumModel = (e) => {
		e.preventDefault ();
		this.props.openModal(AddAquarium, {refreshPage: this.renderAquariums});
	}
	showRemoveAquariumModel = (e) => {
		e.preventDefault ();
		this.props.openModal(RemoveAquarium, {refreshPage: this.renderAquariums, currentAquarium: this.state.currentAquariumId, reset: this.resetOnRemove});
	}
	resetOnRemove = () => {
		this.setState(this.baseState);
	}
	render() {
		return (
			<div className="container">
				<div className="row inner-content">
					<h2>My fish</h2>
					<div className="addBtns">
						{this.createFilterButtons()}
						<div className="action-btn-wrapper">
							{this.state.showCRUDbtns && (
								<div className="fishCRUDbtns">
									<Link to="" onClick={this.showAddFishModel}>+ Add fish to this aquarium</Link>
									<Link to="" onClick={this.showRemoveAquariumModel}>- Remove this aquarium</Link>
								</div>
							)}
							<Link to="" onClick={this.showAddAquariumModel}>+ Add new aquarium</Link>
						</div>
					</div>
					<div className="card-columns">
						{this.filterFish()}

					</div>
				</div>
			</div>
		);
	}
}
