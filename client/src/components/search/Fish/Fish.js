import React from 'react';
import {Col, Row} from 'reactstrap';
import FishBlock from './Block/FishBlock';

export default class SavedAdvices extends React.Component {
	render() {
		return (
			<div className="search-results">
				<h1 className="text-center">Fishes</h1>
				<hr/>
				<Row>
					<Col xs="12">
						<FishBlock
							picture="catfish.jpg"
							title="Catfish"
							info="Catfish, any of the fishes of the order Siluriformes. Catfishes are related to the characins, carp, and minnows and may be placed with them in the superorder Ostariophysi. Some authorities, however, have regarded these groups as suborders, rather than a single order, and have classified them as the suborders Siluroidea and Cyprinoidea of the order Cypriniformes or Ostariophysi."
							extra=	"The name catfish refers to the long barbels, or feelers, which are present about the mouth of the fish and resemble cat whiskers. All catfishes have at least one pair of barbels, on the upper jaw; they may also have a pair on the snout and additional pairs on the chin. Many catfishes possess spines in front of the dorsal and pectoral fins. These spines may be associated with venom glands and can cause painful injuries to the unsuspecting. All catfishes are either naked or armoured with bony plates; none has scales.
									Living catfishes constitute nearly 2,900 species placed in about 35 families. The majority of species inhabit fresh water, but a few, belonging to the families Ariidae and Plotosidae, are marine. Freshwater catfishes are almost worldwide in distribution and live in a variety of habitats from slow or stagnant waters to fast mountain streams; marine catfishes are found in the shore waters of the tropics. Catfishes are generally bottom dwellers, more active by night than by day. Most are scavengers and feed on almost any kind of animal or vegetable matter. All species are egg layers and may exhibit various types of parental care. The brown bullhead (Ictalurus nebulosus), for example, builds and guards a nest and protects its young, while male sea catfishes (Ariidae) carry the marble-sized eggs, and later the young, in their mouths.
									Catfishes vary considerably in size. Small species, such as the dwarf Corydoras, or micro cat (C. hastatus), may be as little as 4 or 5 centimetres (1 1/2–2 inches) long, while the wels (Silurus glanis), a large, European species, may be 4.5 metres (15 feet) in length and 300 kilograms (660 pounds) in weight. A number of the smaller species, especially those of the genus Corydoras, are popular aquarium fishes, while many of the larger catfishes are edible and used as food. Notable examples of the latter are the many North American food and sport fishes of the family Ictaluridae, among them the blue catfish (Ictalurus furcatus), with a maximum length and weight of 1.5 metres and 68 kilograms, and the channel catfish (I. punctatus), growing to about 1 metre and 12 kilograms.
									The ictalurids are more or less typical catfishes; others, however, may be distinctive in appearance or behaviour. The glass catfish (Kryptopterus bicirrhus), for example, is a popular aquarium fish of the family Siluridae noted for its slender, highly transparent body; the banjo catfishes (Aspredinidae) of South America are slim fishes with rough, flattened heads and from above somewhat resemble banjos; the electric catfish (Malapterurus electricus) of Africa can generate up to 450 volts of electricity; the parasitic catfish, or candiru (Vandellia cirrhosa), of South America sometimes invades the urogenital openings of bathers; the talking catfish (Acanthodoras spinosissimus) is an armoured, Amazonian species that makes grunting sounds; the upside-down catfishes (Synodontis batensoda and others) of the family Mochokidae habitually swim upside down; the walking catfish (Clarias batrachus) is an air breather of the family Clariidae that can travel overland."
						/>
					</Col>
				</Row>
			</div>
		);
	}
}
