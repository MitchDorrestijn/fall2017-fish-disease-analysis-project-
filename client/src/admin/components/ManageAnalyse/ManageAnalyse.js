import React from 'react';
import { Button, Form, FormGroup, Input, ButtonGroup, Card } from 'reactstrap';
import ActionButton from '../../../components/base/ActionButton';
import DataAccess from '../../../scripts/DataAccess';

export default class ManageAnalyse extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			errorImages: '',
			errorExcel: '',
			excelSheetOld: null,
			excelSheetNew: [],
			imagesNew: [],
			imagesDB: []
		};
	};

	//change/set State functions:
	changeExcelSheetNew = () => {
		this.setState({
			excelSheetNew: document.getElementById('analyseSheet')
		});
	};
	changeImagesNew = () => {
		this.setState({
			imagesNew: document.getElementById('analyseImages')
		});
	};

	//component mount/unmount functions:
	componentDidMount(){
		//this.loadCurrentExcelsheet();
	};

	//get/post/put data functions:
	// loadCurrentExcelsheet = () => {
	// 	let da = new DataAccess();
	// 	da.getData ('/', (err, res) => {
	// 		if (!err) {
	// 			this.setState({dataFromDB: res.message});
	// 			this.fillData();
	// 		} else {
	// 			console.log('De error is: ' + err.message);
	// 		};
	// 	});
	// };
  //
	uploadImages = () => {
		let errors = [];
		for (let i = 0; i < this.state.imagesNew.files.length; i++) {
			if((/\.(jpg|jpeg|tiff|png)$/i).test(this.state.imagesNew.files[i].name)){

				const file = this.state.imagesNew.files[i];
				let formData = new FormData();
				formData.append('image', file);
				console.log(`${this.state.imagesNew.files[i].name}: right image format.`)

			} else {
				errors.push(this.state.imagesNew.files[i].name);
			};
		};
		if (errors.length > 0) {
			this.setState({errorImages: `Error occurred on ${errors.toString()}, please upload a .GIF, .JPG, .JPEG, .TIFF or .PNG image.`})
		};
	};

	uploadExcel = () => {
		if((/\.xlsx$/i).test(this.state.excelSheetNew.value)){

			const file = this.state.excelSheetNew.files[0];
			let formData = new FormData();
			formData.append('sheet', file);

			// firebase.auth ().currentUser.getIdToken ().then ((result) => {
			// 	const token = result;
			// 	fetch(`http://localhost:5000/api/species/${this.props.customProps.entry.id}/upload`, {
			// 			method: 'POST',
			// 			headers: {
			// 				'Authorization': 'Token ' + token
			// 			},
			// 			mode: 'cors',
			// 			body: formData
			// 	}).then(() => {
			// 		this.props.customProps.refreshPage();
			// 		this.props.toggleModal();
			// 	}).catch ((error) => {
			// 			this.setState({error: "An error occurred"});
			// 	});
			// });
		} else {
			this.setState({errorExcel: "Please upload a excel (.xlsx) file."})
		}
	}

	render(){
		return (
			<div>
				<h2>Import new analyse sheets/images</h2>
				<form>
					<Card className="card">
						<p>Download old analyse sheet:</p>
					</Card>
					<Card>
						<p className="error">{this.state.errorExcel}</p>
						<p>Upload new analyse sheet: <input
							type="file" id="analyseSheet" name="analyseSheet" onChange={this.changeExcelSheetNew}/>
						</p>
					</Card>
					<Button onClick={this.uploadExcel} className='btn-admin'>Add analyse sheet</Button>
					<Card>
						<p className="error">{this.state.errorImages}</p>
						<p>Upload new images for analyse: <input
							type="file" id="analyseImages" name="analyseImages" multiple onChange={this.changeImagesNew}/>
						</p>
					</Card>
					<Button onClick={this.uploadImages} className='btn-admin'>Add analyse images</Button>
				</form>
			</div>
		);
	};
};
