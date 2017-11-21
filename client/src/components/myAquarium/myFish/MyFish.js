import React from 'react';
import Card from '../../base/Card';
import {CardText, CardTitle, CardSubtitle} from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import {Link} from 'react-router-dom';

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
			createdAquariums: ["aquarium1", "aquarium2", "aquarium3"],
			currentAquarium: "aquarium1"
		}
	}
	createFilterButtons = () => {
		let buttons = this.state.createdAquariums.map((button, index) => {
			return (
				<ActionButton key={index} color="primary btn-transparent" buttonText={button} onClickAction={(arr) => this.showSelectedCategory(button)} />
			);
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
	render() {
		return (
			<div className="container">
				<div className="row inner-content">
					<h2>My fish</h2>
					<div className="addBtns">
						{this.createFilterButtons()}
						<Link to="/">+ Add aquarium</Link>
					</div>
					<div className="card-columns">
						{this.filterFish()}
					</div>
				</div>
			</div>
		);
	}
}
