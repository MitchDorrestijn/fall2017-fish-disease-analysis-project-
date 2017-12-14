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
				fishData: [
					{
						"inAquarium":"aquarium1",
						"imageURL":"/recources/emerald-catfish.jpg",
						"title":"Flyingfish",
						"subtitle":"Flies away",
						"description":"Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.",
						"firstAdded":"09 - 07 - 2016",
						"linkTo":"/"
					},
					{
						"inAquarium":"aquarium2",
						"imageURL":"/recources/catfish.jpg",
						"title":"Platfish",
						"subtitle":"Swims quickly",
						"description":"Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large. Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large. Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large. Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.",
						"firstAdded":"09 - 07 - 2016",
						"linkTo":"/"
					},
					{
						"inAquarium":"aquarium3",
						"imageURL":"/recources/loach-catfish.jpg",
						"title":"Potfish",
						"subtitle":"Swims slow",
						"description":"Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large. Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large. Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.",
						"firstAdded":"09 - 07 - 2016",
						"linkTo":"/"
					},
					{
						"inAquarium":"aquarium1",
						"imageURL":"/recources/loach-catfish.jpg",
						"title":"Potfish",
						"subtitle":"Swims slow",
						"description":"Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.",
						"firstAdded":"09 - 07 - 2016",
						"linkTo":"/"
					},
					{
						"inAquarium":"aquarium2",
						"imageURL":"/recources/loach-catfish.jpg",
						"title":"Potfish",
						"subtitle":"Swims slow",
						"description":"Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.",
						"firstAdded":"09 - 07 - 2016",
						"linkTo":"/"
					}
			],
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
		let da = new DataAccess();
		da.getData(`/aquaria/${aquariumName}/fish`,  (err, res) => {
			if (!err) {
				this.setState({ currentAquarium: res.message });
			}
		});
  }
	filterFish = () => {
		// const {currentAquarium} = this.state;
		// if (currentAquarium) {
		// 	for (const elem of currentAquarium.fish) {
		// 		//console.log(elem.species._referencePath.segments[1]);
		// 		let da = new DataAccess();
		// 		da.getData(`/species/${elem.species._referencePath.segments[1]}`,  (err, res) => {
		// 			if (!err) {
		// 				let fishInAquaria = [];
		// 				fishInAquaria.push(
		// 					<Card image={res.message.imageURL}>
		// 						<CardTitle>{res.message.name}</CardTitle>
		// 						<CardSubtitle>{res.message.additional}</CardSubtitle>
		// 						<CardText>
		// 							{res.message.info}
		// 						</CardText>
		// 					</Card>
		// 				);
		// 				console.log(res.message);
		// 			}
		// 		});
		// 	}
		// }
		console.log(this.state.currentAquarium);
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
