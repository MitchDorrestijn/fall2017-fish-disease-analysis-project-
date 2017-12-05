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
			currentAquarium: "aquarium1"
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
		let buttons = []
		this.state.createdAquariums.forEach((key) => {
			if(this.state.createdAquariums.hasOwnProperty(key)) {
				buttons.push(<ActionButton key={key} color="primary btn-transparent" buttonText={this.state.createdAquariums[key].name} onClickAction={(arr) => this.showSelectedCategory(this.state.createdAquariums[key].name)} />);
			}
		});
		return (
			<div>
				{buttons}
			</div>
		)
	}
	showSelectedCategory = (button) => {
    this.setState({ currentAquarium: button });
  }
	filterFish = () => {
		let currentVisibleAquarium = this.state.currentAquarium;
		let filteredFish = this.state.fishData.filter(function(fish){
			return fish.inAquarium === currentVisibleAquarium;
		}).map(function(fish, index){
			return (
				<Card key={index} inAquarium={fish.inAquarium} image={fish.imageURL}>
					<CardTitle>{fish.title}</CardTitle>
					<CardSubtitle>{fish.subtitle}</CardSubtitle>
					<CardText>
						{fish.description}
						<span>First time this specie was added:<br/>{fish.firstAdded}</span>
					</CardText>
					<ActionButton link={true} linkTo={fish.linkTo} color="primary btn-transparent" buttonText="Analyseer vis"/>
				</Card>
			);
		});
		return (
			<div>
				{filteredFish}
			</div>
		);
	}
	showAddFishModel = (e) => {
		e.preventDefault ();
		this.props.openModal(AddFish);
	};
	showAddAquariumModel = (e) => {
		e.preventDefault ();
		this.props.openModal(AddAquarium);
	}
	showRemoveAquariumModel = (e) => {
		e.preventDefault ();
		this.props.openModal(RemoveAquarium);
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
