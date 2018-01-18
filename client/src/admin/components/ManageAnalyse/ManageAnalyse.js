import React from 'react';
import { Button, Card } from 'reactstrap';
import * as firebase from 'firebase';

export default class ManageAnalyse extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			errorImages: [],
			errorExcel: [],
			excelOldSymptomsDiseases: '',
			excelOldQuestions: '',
			excelSheetNew: [],
			imagesNew: []
		};
	};

	//set State functions:
	setExcelSheetNew = () => {
		this.setState({
			excelSheetNew: document.getElementById('analyseSheet')
		});
	};
	setImagesNew = () => {
		this.setState({
			imagesNew: document.getElementById('analyseImages')
		});
	};

	//component mount/unmount functions:
	componentDidMount(){
		this.loadCurrentExcelsheet();
	};
	loadCurrentExcelsheet = () => {
		// Create a root reference of our firebase storage
		let storageRef = firebase.storage().ref();
		// Create a reference to the file we want to download
		let excel1Ref = storageRef.child('excel/symptomenEnZiektes.xlsx');
		let excel2Ref = storageRef.child('excel/Vraagziektekruisjes.xlsx');
		// Get the download URL's for both templates
		excel1Ref.getDownloadURL().then((url) => {
			this.setState({excelOldSymptomsDiseases: url})
		}).catch((error) => {
			console.log(error.serverResponse);
		});
		excel2Ref.getDownloadURL().then((url) => {
			this.setState({excelOldQuestions: url})
		}).catch((error) => {
			console.log(error.serverResponse);
		});
	};

	//Upload multiple images to the storage, if the image name already exist then it will update it
	uploadImages = () => {
		let errors = [];
		for (let i = 0; i < this.state.imagesNew.files.length; i++) {
			if((/\.(jpg|jpeg|tiff|png)$/i).test(this.state.imagesNew.files[i].name)){
				// Put the file in new let
				let file = this.state.imagesNew.files[i];
				// Create a root reference of our firebase storage
				let storageRef = firebase.storage().ref();
				// Upload file to the object 'images/analyse/.......(image extentions)'
				let uploadTask = storageRef.child(`images/analyse/${file.name}`).put(file);

				// Listen for state changes, errors, and completion of the upload
				uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
				}, (error) => {
					this.setState({errorImages: [`${error.serverResponse}`, false]});
				}, () => {
					this.setState({errorImages: [`Upload is done`, true]});
				});
			} else {
				errors.push(this.state.imagesNew.files[i].name);
			};
		};
		if (errors.length > 0) {
			this.setState({errorImages: [`Error occurred on ${errors.toString()}, please upload a .GIF, .JPG, .JPEG, .TIFF or .PNG image.`, false]});
		};
	};

	//Upload a singel Excel file to the storage, if the file exist then it will update it
	uploadExcel = () => {
		if ((/\.xlsx$/i).test(this.state.excelSheetNew.value)){
			// Put the file in new let
			let file = this.state.excelSheetNew.files[0];
			// Create a root reference of our firebase storage
			let storageRef = firebase.storage().ref();
			// Upload file to the object 'excel/.......xlsx'
			let uploadTask = storageRef.child(`excel/${file.name}`).put(file);

			// Listen for state changes, errors, and completion of the upload
			uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				this.setState({errorExcel: [`Upload is ${progress}% done`, true]});
			}, (error) => {
				this.setState({errorExcel: [`${error.serverResponse}`, false]});
			}, () => {
				this.loadCurrentExcelsheet();
			});
		} else {
			this.setState({errorExcel: ["Please upload a excel (.xlsx) file.", false]});
		};
	};

	//check if the message is a succes message. If true it will return succes for its className, if false it will return error for its className
	checkErrorMessage = (Message) => {
		if (Message[1] === true) {
			return 'succes';
		}
		return 'error';
	};

	render(){
		return (
			<div>
				<h2>Analysis</h2>
				<form>
					<Card className="card">
						<p>Download old symptomenEnZiektes.xlsx: <a
							href={this.state.excelOldSymptomsDiseases}>here</a>
						</p>
						<p>Download old Vraagziektekruisjes.xlsx: <a
							href={this.state.excelOldQuestions}>here</a>
						</p>
					</Card>
					<Card>
						<p className={this.checkErrorMessage(this.state.errorExcel)}>{this.state.errorExcel}</p>
						<p>Upload new analyse sheet: <input
							type="file" id="analyseSheet" name="analyseSheet" onChange={this.setExcelSheetNew}/>
						</p>
					</Card>
					<Button onClick={this.uploadExcel} className='btn-admin'>Add analyse sheet</Button>
					<Card>
						<p className={this.checkErrorMessage(this.state.errorImages)}>{this.state.errorImages}</p>
						<p>Upload new images for analyse: <input
							type="file" id="analyseImages" name="analyseImages" multiple onChange={this.setImagesNew}/>
						</p>
					</Card>
					<Button onClick={this.uploadImages} className='btn-admin'>Add analyse images</Button>
				</form>
			</div>
		);
	};
};
