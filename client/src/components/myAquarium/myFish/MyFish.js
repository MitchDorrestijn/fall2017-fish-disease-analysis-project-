import React from 'react';
import Card from '../../base/Card';
import {CardText, CardTitle, CardSubtitle, Button} from 'reactstrap';
import ActionButton from '../../base/ActionButton';

export default class MyFish extends React.Component {
	render() {
		return (
			<div className="container ">
				<h2>My fish</h2>
				<div className="row inner-content">
					<Card size="col-md-4" image="/recources/emerald-catfish.jpg">
						<CardTitle>Flyingfish</CardTitle>
	        	<CardSubtitle>Flies away</CardSubtitle>
	        	<CardText>
							Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
							<span>First time this specie was added:<br/>09 - 07 - 2016</span>
						</CardText>
						<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Analyseer vis"/>
					</Card>
					<Card size="col-md-4" image="/recources/catfish.jpg">
						<CardTitle>Platfish</CardTitle>
	        	<CardSubtitle>Swims quickly</CardSubtitle>
	        	<CardText>
							Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large. DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST
							<span>First time this specie was added:<br/>09 - 07 - 2016</span>
						</CardText>
						<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Analyseer vis"/>
					</Card>
					<Card size="col-md-4" image="/recources/loach-catfish.jpg">
						<CardTitle>Potfish</CardTitle>
	        	<CardSubtitle>Swims slow</CardSubtitle>
	        	<CardText>
							Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large. DIFFRENT LENGHT TO TEST
							<span>First time this specie was added:<br/>09 - 07 - 2016</span>
						</CardText>
						<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Analyseer vis"/>
					</Card>
					<Card size="col-md-4" image="/recources/loach-catfish.jpg">
						<CardTitle>Potfish</CardTitle>
	        	<CardSubtitle>Swims slow</CardSubtitle>
	        	<CardText>
							Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
							<span>First time this specie was added:<br/>09 - 07 - 2016</span> DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST
						</CardText>
						<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Analyseer vis"/>
					</Card>
					<Card size="col-md-4" image="/recources/loach-catfish.jpg">
						<CardTitle>Potfish</CardTitle>
	        	<CardSubtitle>Swims slow</CardSubtitle>
	        	<CardText>
							Amphiliids are generally small catfish with tapering, elongated bodies. The pectoral and ventral fins are large.
							<span>First time this specie was added:<br/>09 - 07 - 2016</span> DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST DIFFRENT LENGHT TO TEST
						</CardText>
						<ActionButton link={true} linkTo="/" color="primary btn-transparent" buttonText="Analyseer vis"/>
					</Card>
			</div>
			</div>
		);
	}
}
