import React from 'react';
import {
	ModalHeader,
	ModalBody,
	Button,
	FormGroup,
	Label,
	InputGroup,
	Input
} from 'reactstrap';
import Error from './Error';
import {Col, Row} from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';
import * as firebase from 'firebase';

class AddTodaysData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userID: "",
			createdAquariums: []
		};
	};
	setUserID = (userID) => {
		this.setState({
			userID: userID
		});
	};
	setCreatedAquariums = (aquariums) => {
		this.setState({
			createdAquariums: aquariums
		});
	};
	setselectedAquariumID = (aquariumID) => {
		this.setState({
			selectedAquariumID: aquariumID
		});
	};
	componentWillMount() {
		this.initSetters();
	};
	initSetters = () => {
		let da = new DataAccess ();
		da.getData ('/aquaria', (err, res) => {
			this.setCreatedAquariums(res.message);
			if (!err) {

			} else {
				// error
			};
		});
	};

	registerTodaysData = () => {
		let date = new Date ();
		let day = date.getDate ();
		let month = (date.getMonth () + 1);
		let year = date.getFullYear ();

		const todaysData = {
			data: {
				date: day + "-" + month + "-" + year,
				phosphate: document.getElementById("phosphate").value,
				nitrate: document.getElementById("nitrate").value,
				nitrite: document.getElementById("nitrite").value,
				iron: document.getElementById("iron").value,
				gH: document.getElementById("gh").value,
				temperature: document.getElementById("temperature").value,
				oxygen: document.getElementById("oxygen").value,
				carbon: document.getElementById("carbon").value,
				dioxide: document.getElementById("dioxide").value,
				kH: document.getElementById("kh").value,
				chlorine: document.getElementById("chlorine").value
			}
		};
		this.postTodaysData(todaysData);
	};

 fillAquariumSelect = (aquariums) => {
	 let options = [];
	 for(let key in this.state.createdAquariums) {
		 if(this.state.createdAquariums.hasOwnProperty(key)) {
			 options.push(<option key={key} value={this.state.createdAquariums[key].id}>{this.state.createdAquariums[key].name}</option>);
		 }
	 }
	 return options;
 }


	postTodaysData = (dataObject) => {
		let da = new DataAccess ();
		da.postData(`/aquaria/${document.getElementById("aquarium").value}/entries`, dataObject, (err, res) => {
			if (!err) {
				alert("Succesvol ingevoerd");
			} else {
				console.log(err);
				// this.showError(true, err.message);
			};
		});
	};
  //
	// getUserAquariums = (userID) => {
	// 	let da = new DataAccess ();
	// 	da.postData(`/aquaria//entries`, dataObject, (err, res) => {
	// 		if (!err) {
	// 			alert("Succesvol opgehaalt");
	// 		} else {
	// 			console.log(err);
	// 			this.showError(true, err.message);
	// 		};
	// 	});
	// };

	render() {
		console.log(this.state.selectedAquariumID);
		return (
			<div>
				<ModalHeader toggle={this.props.toggleModal}>Today's aquarium data</ModalHeader>
				<ModalBody>
					{ this.props.isErrorVisible ?
						<Error errorContent={this.props.errorContent} /> :
						null
					}
					<Row>
						<Col>
							<FormGroup>
								<Label for="phosphate">Phosphate</Label>
								<InputGroup>
									<Input type="number" id="phosphate" placeholder="Phosphate"/>
								</InputGroup>
							</FormGroup>
						</Col>
						<Col>
							<FormGroup>
								<Label for="nitrate">Nitrate</Label>
								<InputGroup>
									<Input type="number" id="nitrate" placeholder="Nitrate"/>
								</InputGroup>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormGroup>
								<Label for="nitrite">Nitrite</Label>
								<InputGroup>
									<Input type="number" id="nitrite" placeholder="Nitrite"/>
								</InputGroup>
							</FormGroup>
						</Col>
						<Col>
							<FormGroup>
								<Label for="iron">Iron</Label>
								<InputGroup>
									<Input type="number" id="iron" placeholder="Iron"/>
								</InputGroup>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormGroup>
								<Label for="gh">gH</Label>
								<InputGroup>
									<Input type="number" id="gh" placeholder="gH"/>
								</InputGroup>
							</FormGroup>
						</Col>
						<Col>
							<FormGroup>
								<Label for="temperature">Temperature</Label>
								<InputGroup>
									<Input type="number" id="temperature" placeholder="Temperature"/>
								</InputGroup>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormGroup>
								<Label for="oxygen">Oxygen</Label>
								<InputGroup>
									<Input type="number" id="oxygen" placeholder="Oxygen"/>
								</InputGroup>
							</FormGroup>
						</Col>
						<Col>
							<FormGroup>
								<Label for="carbon">Carbon</Label>
								<InputGroup>
									<Input type="number" id="carbon" placeholder="Carbon"/>
								</InputGroup>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormGroup>
								<Label for="dioxide">Dioxide</Label>
								<InputGroup>
									<Input type="number" id="dioxide" placeholder="Dioxide"/>
								</InputGroup>
							</FormGroup>
						</Col>
						<Col>
							<FormGroup>
								<Label for="kh">kH</Label>
								<InputGroup>
									<Input type="number" id="kh" placeholder="kH"/>
								</InputGroup>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormGroup>
								<Label for="chlorine">Chlorine</Label>
								<InputGroup>
									<Input type="number" id="chlorine" placeholder="Chlorine"/>
								</InputGroup>
							</FormGroup>
						</Col>
						<Col>
							<FormGroup>
								<Label for="aquarium">Aquarium</Label>
								<InputGroup>
									<Input type="select" name="select" id="aquarium">
										{this.fillAquariumSelect(this.state.createdAquariums)}
									</Input>
								</InputGroup>
							</FormGroup>
						</Col>
					</Row>

					<hr/>
					<Button outline className="modalLink" color="secondary" onClick={this.registerTodaysData} block>Add data</Button>

				</ModalBody>
			</div>
		);
	}
}

export default AddTodaysData;
