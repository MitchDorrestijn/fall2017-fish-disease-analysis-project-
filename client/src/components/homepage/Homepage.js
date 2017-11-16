import React from 'react';
import SingleBlock from './SingleBlock';
import Footer from '../base/Footer';
import Translate from 'translate-components';

export default class Homepage extends React.Component {
		render(){
			return (
				<div className="block-wrapper row white">
					<SingleBlock
						title={<Translate>Analyse your fish</Translate>}
						text={<Translate>The Bassleer Biofish analysis can help you identify the disease of your fish and give advice for a possible treatment.</Translate>}
						background="recources/homepage-achtergrond.jpg"
						btnText={<Translate>Start Analysis</Translate>}
						link="/nogEenLink"
					/>
					<SingleBlock
						title={<Translate>My Aquarium</Translate>}
						text={<Translate>‘My aquarium’ is a way to save all the data of your aquarium, so diseases can be prevented and causes can be found.</Translate>}
						background="recources/homepage-achtergrond-2.jpg"
						btnText={<Translate>Register</Translate>}
						link="/eenLink"
					/>
					<Footer />
				</div>
			);
		}
}