import React from 'react';
import SingleBlock from './SingleBlock';

export default class Homepage extends React.Component {
		render(){
			return (
				<div className="block-wrapper row white">
					<SingleBlock
						title="Analyse your fish"
						text="The Bassleer Biofish analysis can help you identify the disease of your fish and give advice for a possible treatment."
						background="recources/homepage-achtergrond.jpg"
						btnText="test"
						link="/nogEenLink"
					/>
					<SingleBlock
						title="My Aquarium"
						text="‘My aquarium’ is a way to save all the data of your aquarium, so diseases can be prevented and causes can be found."
						background="recources/homepage-achtergrond-2.jpg"
						btnText="test"
						link="/eenLink"
					/>
				</div>
			);
		}
}
