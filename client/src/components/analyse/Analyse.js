import React from 'react';
import ContentContainer from '../myAquarium/ContentContainer';
import Checkbox from './Checkbox';
import ActionButton from '../base/ActionButton';
import { UncontrolledCarousel, Row, Col } from 'reactstrap';
import DataAccess from '../../scripts/DataAccess';
import DiseaseBlock from '../search/Diseases/Block/DiseaseBlock';
import { Redirect } from 'react-router';
import projectName from '../../data/firebaseProject';

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
			redirect: false,
			questions: []
		}
	}

	componentWillMount(){
		let da = new DataAccess(true);
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
				pictures.push(<img key={i} src={this.state.questions[questionNumber].pictures[i]+"test"} alt={this.state.questions[questionNumber].pictures[i]} />);
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
					<li className="answer_wrapper">
						<span className='checkbox_wrapper'><Checkbox name='answer' value={object.name} disabled={false} value={object.name} />{object.name}</span>
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
			let da = new DataAccess(true);
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
		window.scrollTo(0,0);
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
		let da = new DataAccess(true);
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

	//Render the results a a DiseaseBlock
	displayResults = (results) => {
		let diseases = [];
		for(let key in results) {
			if(results.hasOwnProperty(key)) {
				let {disease, diseaseCode} = results[key];
				if(results[key].details !== undefined){
					const {imageUrl, description, treatment, symptoms} = results[key].details;
					diseases.push(
						<DiseaseBlock key={diseaseCode} picture={imageUrl} title={disease} info={description} symptoms={symptoms} treatment={treatment}/>
					)
				} else {
					diseases.push(
						<DiseaseBlock key={diseaseCode} title={disease} />
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

	//Functions to separate diseases with and without score
	getResultsWithoutScore = () => {
		return this.state.results.filter((elem) => !elem.hasOwnProperty("score"));
	}

	getResultsWithScore = () => {
		return this.state.results.filter((elem) => elem.hasOwnProperty("score"));
	}

	displayResultsWithScore = () => {
		return this.displayResults(this.getResultsWithScore());
	}

	displayResultsWithoutScore = () => {
		return this.displayResults(this.getResultsWithoutScore());
	}

	//Redirect updater
	redirect = () => {
		this.setState({redirect: true});
	}




	render(){
		if(!this.state.redirect){
			return(
				<div className='analyse_wrapper'>
				<ContentContainer size="12" widthClass='full'>
					{this.state.showResults ?
						<div className='search-results'>
							{this.state.allAnswers.length === 0 ?
								<h2>You did not answer any questions :(</h2> :
								<div>
									<h2>Based on your given answers you fish might have one of the following diseases:</h2>
									{this.props.loggedIn ? <button onClick={this.redirect} className='btn btn-outline-primary btn-transparent request_btn'>Request a consult</button> : <button className='btn btn-outline-primary btn-transparent request_btn'>Login or register to request a consult</button>}
									<h3>Your fish is likely to suffer from:{this.state.showFollowUpBtn && <button className='btn btn-outline-primary btn-transparent right_btn' disabled={this.state.allAnswers.length === 0} onClick={this.startDeepAnalyse}>Do a more detailed analysis</button>}</h3>
									{this.displayResultsWithoutScore()}
									<h3>Your fish might also have:</h3>
									{this.displayResultsWithScore()}
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
			)
		} else {
			return (<Redirect to="/myAquarium/requestConsult"/>);
		}
	}
}
