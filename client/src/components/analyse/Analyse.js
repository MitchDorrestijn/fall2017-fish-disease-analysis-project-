import React from 'react';
import ContentContainer from '../myAquarium/ContentContainer';
import Checkbox from './Checkbox';
import ActionButton from '../base/ActionButton';
import { UncontrolledCarousel, Row, Col } from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';
import FishesBlock from '../search/Fishes/Block/FishesBlock';

export default class Analyse extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			questionNumber: 0,
			showResults: false,
			answerForCurrentQuestion: null,
			allAnswers: [],
			loaded: false,
			showFollowUpBtn: true,
			results: null,
			questions: [
				// {
				// 	name: "Dit is een vraag",
				// 	answers: [
				// 		{
				// 			name: "Antwoord 1",
				// 			pictures: [
				// 				"/images/fish/catfish.jpg",
				// 				"/images/fish/goldfish.jpg"
				// 			]
				// 		},
				// 		{
				// 			name: "Antwoorw2"
				// 		}
				// 	]
				// },
				// {
				// 	name: "Dit is vraag 2",
				// 	pictures: [
				// 		"/images/fish/catfish.jpg",
				// 		"/images/fish/catfish.jpg"
				// 	],
				// 	answers: [
				// 		{
				// 			name: "Antwoord 3434",
				// 			pictures: [
				// 				"/images/fish/catfish.jpg",
				// 				"/images/fish/catfish.jpg",
				// 				"/images/fish/catfish.jpg",
				// 				"/images/fish/catfish.jpg",
				// 				"/images/fish/catfish.jpg",
				// 				"/images/fish/catfish.jpg"
				// 			]
				// 		},
				// 		{
				// 			name: "Antwoorw2",
				// 			pictures: [
				// 				"/images/fish/catfish.jpg",
				// 				"/images/fish/catfish.jpg"
				// 			]
				// 		},
				// 		{
				// 			name: "Antwoorw3",
				// 			pictures: [
				// 				"/images/fish/catfish.jpg"
				// 			]
				// 		}
				// 	]
				// }
			]
		}
	}

	componentWillMount(){
		let da = new DataAccess();
		da.getData(`/questions/shallow/`, (err, res) => {
			if(!err){
				this.setState({questions: res.message}, () => {
					this.setState({loaded: true});
				});
			} else {
				console.log(err);
			}
		});
	}

	//Renders a question based on the given questionNumber
	renderQuestions = (questionNumber) => {
		let questions = []; //Holds the questions
		let pictures = []; //Holds the pictures
		if(this.state.questions[questionNumber].pictures !== undefined){
			for(let i=0; i<this.state.questions[questionNumber].pictures.length; i++){
				//Create an image element if the question itself has images
				pictures.push(<img key={i} src={this.state.questions[questionNumber].pictures[i]} alt={this.state.questions[questionNumber].pictures[i]} />);
			}
		}

		//Prepare the question structure
		questions.push(
			<div key={questionNumber}>
				<h2 className='question'>{this.state.questions[questionNumber].name}</h2>
				{pictures.length > 0 && <div className='question_pictures centerBlock'><span>{pictures}</span></div>}
			</div>
		)

		//Return the question structure
		return questions
	}

	//Gets a questionnumeber that corresponds to the current question
	renderAnswers = (questionNumber) => {
		let answers = [];
		let object = {};

		//Loop trough every answer of the current question
		for(let i=0; i<this.state.questions[questionNumber].answers.length; i++){
			object.name = this.state.questions[questionNumber].answers[i].name;
			object.pictures = [];

			if (this.state.questions[questionNumber].answers[i].pictures) {
				//Loop trough all images of the current answer
				for(let j=0; j<this.state.questions[questionNumber].answers[i].pictures.length; j++){
					object.pictures.push(this.state.questions[questionNumber].answers[i].pictures[j]);
				}
			}

			//Create <img> tags for every image
			let answerPictures = object.pictures.map ((elem, i) => {
				if(object.pictures.length > 1) {
					return {
						src: elem,
						key: i,
						altText: '',
	 					caption: ''
					}
				} else {
					return <img key={i} src={elem}/>;
				}
			});

			//Prepare images and checkbox layout
			answers.push(
				<div key={answers.length}>
					<li>
						<span className='checkbox_wrapper'>{object.name}<br /><Checkbox name='answer' value={object.name} disabled={false} value={object.name} /></span>
						{answerPictures.length > 0  ?
							<div>
								{answerPictures.length > 1 ? <UncontrolledCarousel items={answerPictures} /> : answerPictures}
							</div> :
							null
						}
					</li>
				</div>
			);
		}

		//Return the values
		return answers;
	}

	//Handles the checked answers
	getAnswers = () => {
		let answersArray = [];
		let singleAnswer = Array.from( document.getElementsByName("answer"));
    answersArray = []; //Makes the array empty so it can be rebuild with unique items
    singleAnswer.forEach((v) => {
    	if (v.checked) {
      	answersArray.push(v.value);
      }
    });

		//Prepare the object
		let answerObject = {
			question: this.state.questions[this.state.questionNumber].name,
			answers: answersArray
		}

		//Put the answers for the current question in the state
		this.setState({answerForCurrentQuestion: answerObject});
	}

	//Renders the question number to provide the next question
	incrementQuestionNumber = () => {
		let answerForCurrentQuestion = this.state.answerForCurrentQuestion;

		//Put all answers in an array that will be send later
		if(answerForCurrentQuestion !== null){
			this.setState(prevState => ({
			  allAnswers: [...prevState.allAnswers, answerForCurrentQuestion]
			}));
		}

		if(this.state.questionNumber < this.state.questions.length - 1){
			this.setState((previousState) => {
				//Clear the current answer and increment the question number
    		return {questionNumber: previousState.questionNumber + 1, answerForCurrentQuestion: null};
    	});
		} else {
			let da = new DataAccess();
			da.postData(`/questions/results`, {answers: this.state.allAnswers}, (err, res) => {
				if(!err){
					console.log('Tonen op het scherm:');
					console.log(res.message);
					//There are no more questions so show the results
					this.setState({showResults: true, answerForCurrentQuestion: null, results: res.message}, () => {
					});
				} else {
					console.log(err);
				}
			})
		}

		//Uncheck all checkboxes
		this.checkAll('answers', false);
	}


	//Checks or unchecks all checkboxes in a form
	checkAll = (formname, checktoggle) => {
		let checkboxes = new Array();
		checkboxes = document[formname].getElementsByTagName('input');
		for (let i=0; i<checkboxes.length; i++)  {
			if (checkboxes[i].type == 'checkbox')   {
				checkboxes[i].checked = checktoggle;
			}
		}
	}

	//Renders the progress on the right side of the screen
	renderProgress = () => {
		return this.state.allAnswers.map((elem, iterator) => {
			return (
				<li key={iterator}>
					<h6>{elem.question}</h6>
					<ul>
						{
							elem.answers.map((elem2, iterator2) => {
								return <li key={iterator2}><small>{elem2}</small></li>;
							})
						}
					</ul>
				</li>
			);
		});
	}

	//Starts a deep analyse by submitting all answers, the system will provide new questions.
	startDeepAnalyse = () => {
		let da = new DataAccess();
		da.postData(`/questions/deep/`, {answers: this.state.allAnswers}, (err, res) => {
			if(!err){
				console.log('Vervolgvragen:');
				console.log(res.message);
				//Reset the states to show the new questions
				this.setState({questions: res.message, showResults: false, allAnswers: [], questionNumber: 0, showFollowUpBtn: false});
			} else {
				console.log(err);
			}
		});
	}


	displayResults = () => {
		let diseases = [];
		for(var key in this.state.results) {
			if(this.state.results.hasOwnProperty(key)) {
				let {disease, score, diseaseCode} = this.state.results[key];
				if(score > 0){
					diseases.push(
						// <p key={key}>Score: {score} | Ziekte: {disease} | Code: {diseaseCode}</p>
						<FishesBlock key={diseaseCode} picture={disease} title={disease} info={disease} additional={score}/>
					)
				}
			}
		}
		return (
			<div className="results-wrapper">
				{diseases}
			</div>
		)
	}











	render(){
		return(
			<div className='analyse_wrapper'>
			<ContentContainer size="12" widthClass='full'>
				{this.state.showResults ?
					<div className='search-results'>
						{this.state.allAnswers.length === 0 ?
							<h2>You did not answer any questions :(</h2> :
							<div>
								<h2>Based on your given answers you fish might have one of the following diseases:</h2>
								{this.state.showFollowUpBtn && <button className='btn btn-outline-primary btn-transparent' disabled={this.state.allAnswers.length === 0} onClick={this.startDeepAnalyse}>Do a more detailed analysis</button>}
								{this.displayResults()}
							</div>
						}
					</div> :
					<div className='analyse_wrapper'>
						{this.state.loaded &&
						<div>
							{this.renderQuestions(this.state.questionNumber)}
							<hr />
								<form name='answers' onChange={this.getAnswers}>
									<ul>
											{this.renderAnswers(this.state.questionNumber)}
									</ul>
								</form>
								<ActionButton buttonText="Next question" onClickAction={this.incrementQuestionNumber} color="primary btn-transperant full-width"/>
						</div>
					}
					</div>
				}
			</ContentContainer>
			<div className='progress'>
				<ul className='progress-wrapper'>
					<h4>Your progress:</h4>
					{this.state.allAnswers.length > 0 && this.renderProgress()}
				</ul>
			</div>
		</div>
		);
	}
}






// 	fixDieTabel = (answers) => {
// 	let answerPicturesRow = [];
// 	let answerOptionsRow = [];
//
// 	console.log(answers);
//
// 	answers.forEach (answer => {
// 		let pictures;
// 		if (answer.hasOwnProperty("pictures")) {
// 			pictures = answer.pictures.map (elem => <img src={elem} alt={elem}/>);
// 		} else {
// 			pictures = null;
// 		}
// 		answerPicturesRow.push(<td>{pictures}</td>);
// 		answerOptionsRow.push(<td>{answer.name}</td>);
// 	});
//
// 	return (
// 		<table style={{tableLayout: "fixed"}}>
// 			<tbody>
// 				<tr>{answerPicturesRow}</tr>
// 				<tr>{answerOptionsRow}</tr>
// 			</tbody>
// 		</table>
// 	);
// };
