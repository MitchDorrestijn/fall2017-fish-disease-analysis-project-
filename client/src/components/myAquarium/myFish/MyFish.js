import React from 'react';
import Card from '../../base/Card';
import {CardText, CardTitle, CardSubtitle} from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import {Link} from 'react-router-dom';
import AddFish from '../../modal/AddFish';
import AddAquarium from '../../modal/AddAquarium';
import RemoveAquarium from '../../modal/RemoveAquarium';
import DataAccess from '../../../scripts/DataAccess';

export default class MyFish extends React.Component {
	constructor(props){
		super(props);
		this.state = {
				fishData: [],
			createdAquariums: "",
			currentAquarium: ""
		}
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
					/>
				);
			}
		}
		return (
			<div>
				{buttons}
			</div>
		)
	}
	showSelectedCategory = (aquariumName) => {
		console.log(aquariumName);
		let da = new DataAccess();
		da.getData(`/aquaria/${aquariumName}/fish`,  (err, res) => {
			if (!err) {
				this.setState({ currentAquarium: res.message });
			}
		});
  }
	filterFish = () => {
		if (this.state.currentAquarium) {
			const {fish} = this.state.currentAquarium;
			const result = fish.map ((elem) => {
				return (
					<Card key={elem.id} image={elem.species.imageUrl}>
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
	}
	showAddFishModel = (e) => {
		e.preventDefault ();
		this.props.openModal(AddFish, {refreshPage: this.renderAquariums});
	};
	showAddAquariumModel = (e) => {
		e.preventDefault ();
		this.props.openModal(AddAquarium, {refreshPage: this.renderAquariums});
	}
	showRemoveAquariumModel = (e) => {
		e.preventDefault ();
		this.props.openModal(RemoveAquarium, {refreshPage: this.renderAquariums});
	}
	render() {
		return (
			<div className="container">
				<div className="row inner-content">
					<h2>My fish</h2>
					<div className="addBtns">
						{this.createFilterButtons()}
						<Link to="" onClick={this.showAddAquariumModel}>+ Add aquarium</Link>
						<Link to="" onClick={this.showAddFishModel}>+ Add fish</Link>
						<Link to="" onClick={this.showRemoveAquariumModel}>- Remove aquarium</Link>
					</div>
					<div className="card-columns">
						{this.filterFish()}

					</div>
				</div>
			</div>
		);
	}
}
