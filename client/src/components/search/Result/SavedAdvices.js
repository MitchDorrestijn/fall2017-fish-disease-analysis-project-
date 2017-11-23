import React from 'react';
import {Col, Row} from 'reactstrap';
import AdviceDate from './AdviceDate';
import AdviceMatch from './AdviceMatch';
import AdvicePicture from './AdvicePicture';
import AdviceInfo from './AdviceInfo';
import AdviceSymptoms from './AdviceSymptoms';
import AdviceTreatment from './AdviceTreatment';

export default class SavedAdvices extends React.Component {
	render() {
		return (
			<div className="saved-advices">
				<h1 className="text-center">Saved advices</h1>
				<Row className="advice">
					<AdvicePicture src="schimmel3"/>
					<AdviceInfo title="White spot disease - Ichthyophthirius multifiliis">
						The white spot disease is one of the most common
						fish diseases. Infected fish have small white spots
						on the skin and gills.It can lead to the loss of
						skin and ulcers. These wounds can harm the ability
						of a fish to control the movement of water into its body.
					</AdviceInfo>
					<AdviceSymptoms>
						<li>White spots</li>
						<li>Wobbling</li>
						<li>No appetite</li>
						<li>Skin disease</li>
					</AdviceSymptoms>
					<AdviceDate>17-11-2017</AdviceDate>
					<AdviceMatch>87</AdviceMatch>
					<AdviceTreatment>
						The most effective prevention is quarantining new fish for two weeks and plants for four days in a separate tank. Fish that survive an ich infection may develop at least a partial immunity, which paralyzes trophonts that attempt to infect it.
						<h5>Heat treatment</h5>
						Only during a free floating "swarm out" phase is a successful treatment possible. We therefore recommend raising the water temperature by 3°C (but not over 30 °C). This accelerates the life cycle, which in turn improves the chances of catching the parasite in a vulnerable swarm out phase.
						<h5>Salt treatment</h5>
						Salt treatment consists of adding aquarium salt until a specific density of 1.002 g/cm3 is achieved, as the parasites are less tolerant of salt than fish. This is not practical in ponds because even a light salt solution of 0.01% (100 mg/L), would require large quantities of salt. Fish can be dipped in a 0.3% (3 g/L) solution for thirty seconds to several minutes, or they can be treated in a prolonged bath at a lower concentration (0.05% = 500 mg/L)
						<h5>Resource</h5>
						- Aquarium salt (Natriumchloride)
						<h5>Chlorine treatment</h5>
						For treating koi and goldfish, chlorine, in the form of tap water, is very effective in removing not only the threadlike parasites, but eventually the persistent cysts. Threadlike infestations on fish will disappear overnight. Cysts will take a couple of weeks and possibly a couple of water changes to eliminate.
						<h5>Resource</h5>
						- Chlorine / tap water
					</AdviceTreatment>
				</Row>
			</div>
		);
	}
}