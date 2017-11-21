import React from 'react';
import Card from '../../base/Card';
import {CardText, CardTitle, CardSubtitle} from 'reactstrap';
import ActionButton from '../../base/ActionButton';
import {Link} from 'react-router-dom';

export default class MyFish extends React.Component {
	render() {
		return (
			<div className="container">
				<div className="row inner-content">
					<h2>My fish</h2>
					<div className="addBtns">
						<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Aquarium 1" />
						<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Aquarium 2" />
						<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Aquarium 3" />
						<Link to="/">+ Add aquarium</Link>
					</div>
					<div className="card-columns">
						<Card image="/recources/emerald-catfish.jpg">
							<CardTitle>Flyingfish</CardTitle>
		        	<CardSubtitle>Flies away</CardSubtitle>
		        	<CardText>
								Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
								<span>First time this specie was added:<br/>09 - 07 - 2016</span>
							</CardText>
							<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Analyseer vis"/>
						</Card>

						<Card image="/recources/catfish.jpg">
							<CardTitle>Platfish</CardTitle>
		        	<CardSubtitle>Swims quickly</CardSubtitle>
		        	<CardText>
								Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
								Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
								Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
								Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
								<span>First time this specie was added:<br/>09 - 07 - 2016</span>
							</CardText>
							<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Analyseer vis"/>
						</Card>

						<Card image="/recources/loach-catfish.jpg">
							<CardTitle>Potfish</CardTitle>
		        	<CardSubtitle>Swims slow</CardSubtitle>
		        	<CardText>
								Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
								Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
								Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
								<span>First time this specie was added:<br/>09 - 07 - 2016</span>
							</CardText>
							<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Analyseer vis"/>
						</Card>

						<Card image="/recources/loach-catfish.jpg">
							<CardTitle>Potfish</CardTitle>
							<CardSubtitle>Swims slow</CardSubtitle>
							<CardText>
								Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
								<span>First time this specie was added:<br/>09 - 07 - 2016</span>
							</CardText>
							<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Analyseer vis"/>
						</Card>

						<Card image="/recources/loach-catfish.jpg">
							<CardTitle>Potfish</CardTitle>
							<CardSubtitle>Swims slow</CardSubtitle>
							<CardText>
								Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
								<span>First time this specie was added:<br/>09 - 07 - 2016</span>
							</CardText>
							<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Analyseer vis"/>
						</Card>
					</div>
				</div>
			</div>
		);
	}
}
