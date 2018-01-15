const Question = require("./Question");
const Answer = require("./Answer");
const Symptom = require("./Symptom");
const Disease = require("./Disease");

module.exports = class QuestionContainer {
	constructor(fileParserQuestions, fileParserFollowUpQuestions, config) {
		this.config = config;
		this.questions = QuestionContainer._stripFollowUpDuplicates(
			QuestionContainer._addFollowUpQuestions(
				QuestionContainer._fillQuestions(
					fileParserQuestions,
					config
				),
				fileParserFollowUpQuestions,
				config
			)
		);
	}

	static _stripFollowUpDuplicates (questions) {
		let allFollowUpQuestionNames = [];

		for (const question of questions) {
			for (const answer of question.getAnswers()) {
				for (const followUpQuestion of answer.getFollowUpQuestions()) {
					allFollowUpQuestionNames.push (followUpQuestion.getName());
				}
			}
		}

		allFollowUpQuestionNames = allFollowUpQuestionNames.filter((item, pos) => allFollowUpQuestionNames.indexOf(item) === pos);

		for (let i = 0; i < questions.length; i++) {
			for (const elem of allFollowUpQuestionNames) {
				if (questions[i].getName() === elem) {
					questions.splice (i, 1);
					i--;
				}
			}
		}

		return questions;
	}

	static _addFollowUpQuestions(questions, fileParser, config) {
		const {answersColumn} = config.questionsAndFollowUpQuestions;
		const {followUpQuestionsRow} = config.questionsAndFollowUpQuestions;
		const {start: questionsStart} = config.questionsAndFollowUpQuestions.questions;
		const {start: followUpQuestionsStart} = config.questionsAndFollowUpQuestions.followUpQuestions;

		for (
			let i = questionsStart + 1;
			!(
				fileParser.getField(answersColumn, i) === undefined &&
				fileParser.getField(answersColumn, i+1) === undefined &&
				fileParser.getField(answersColumn, i+2) === undefined
			);
			i++
		) {
			if (fileParser.getField (answersColumn, i) !== undefined) {
				for (let j = followUpQuestionsStart; fileParser.getField(j, followUpQuestionsRow); j++) {
					if (fileParser.getField(j, i) === "x") {
						for (let k = 0; k < questions.length; k++) {
							// Loop door alle vragen
							for (let l = 0; l < questions[k].getAnswers().length; l++) {
								// Loop door alle antwoorden van die vraag
								if (questions[k].getAnswers()[l].getName() === fileParser.getField(answersColumn, i)) {
									// Als het antwoord overeenkomt met het antwoord in deze sheet
									for (let m = 0; m < questions.length; m++) {
										// Push de vraag uit de hoofdvragen naar de followUpQuestions
										if (questions[m].getName() === fileParser.getField(j, followUpQuestionsRow)) {
											questions[k].getAnswers()[l].addFollowUpQuestion(questions[m]);
										}
									}
								}
							}
						}
					}
				}
			}
		}

		return questions;
	}

	static _fillQuestions(fileParser, config) {
		const {start: questionsStart} = config.questionAnswersAndSymptoms.questions;
		let {start: symptomsStart, end: symptomsEnd} = config.questionAnswersAndSymptoms.symptoms;
		let {start: diseasesStart} = config.questionAnswersAndSymptoms.diseases;
		const {
			questionsColumn,
			answersColumn,
			answersYOffset,
			picturesColumn,
			symptomsRow,
			symptomMarker,
			diseaseMarker
		} = config.questionAnswersAndSymptoms;

		// Bepaal index van symptomsStart aan de hand van een string
		if (typeof symptomsStart === "string") {
			for (let i = 0; i < fileParser.getRow(symptomsRow).length; i++) {
				if (fileParser.getField(i, symptomsRow) === symptomsStart) {
					symptomsStart = i + 1;
				}
			}
		}

		// Bepaal index van symptomsEnd
		if (typeof symptomsEnd === "string") {
			for (let i = 0; i < fileParser.getRow(symptomsRow).length; i++) {
				if (fileParser.getField(i, symptomsRow) === symptomsEnd) {
					symptomsEnd = i;
				}
			}
		}

		// Bepaal index van diseasesStart
		if (typeof diseasesStart === "string") {
			for (let i = 0; i < fileParser.getRow(symptomsRow).length; i++) {
				if (fileParser.getField(i, symptomsRow) === diseasesStart) {
					diseasesStart = i;
				}
			}
		}

		let questions = [];
		for (
			let i = questionsStart;
			!(
				fileParser.getField(questionsColumn, i) === undefined &&
				fileParser.getField(answersColumn, i) === undefined &&
				fileParser.getField(questionsColumn, i+1) === undefined &&
				fileParser.getField(answersColumn, i+1) === undefined
			);
			i++
		) {
			// Gaat door de hele lijst heen tot dat er gee vragen+antwoorden meer zijn.
			if (fileParser.getField(questionsColumn, i) !== undefined) {
				let answers = [];
				for (let j = answersYOffset; fileParser.getField(answersColumn, i+j) !== undefined; j++) {
					// Gaat door alle antwoorden van de vraag heen
					let symptoms = [];
					let directDiseases = [];
					for (let k = symptomsStart; fileParser.getField(k, symptomsRow) !== undefined; k++) {
						// Gaat door alle vakjes van de symptomen en directe ziektes van de antwoorden heen
						if (fileParser.getField(k, i+j) === symptomMarker) {
							symptoms.push(new Symptom(fileParser.getField(k, symptomsRow)));
						}
						if (fileParser.getField(k, i+j) === diseaseMarker) {
							directDiseases.push(new Disease(fileParser.getField(k, symptomsRow)));
						}
					}
					let pictures = fileParser.getField(picturesColumn, i+j);
					pictures = pictures ? (
						pictures.split(/;/g).filter(elem => elem !== ' ').map(elem => elem.trim())
					) : (
						pictures
					);
					answers.push(
						new Answer(
							fileParser.getField(answersColumn, i+j), // naam
							pictures, // foto
							symptoms,
							directDiseases
						)
					);
				}
				if (answers.length > 0) {
					// Vragen zonder antwoorden worden niet opgeslagen.
					let pictures = fileParser.getField(picturesColumn, i);
					pictures = pictures ? (
						pictures.split(/;/g).filter(elem => elem !== ' ').map(elem => elem.trim())
					) : (
						pictures
					);
					questions.push(new Question(fileParser.getField(questionsColumn, i), pictures, answers));
				}
			}
		}

		return questions;
	}

	getAll() {
		return this.questions;
	}

	getQuestionByName(name) {
		for (const question of this.questions) {
			if (question.getName() === name) {
				return question;
			} else {
				for (const answer of question.getAnswers()) {
					for (const followUpQuestion of answer.getFollowUpQuestions()) {
						if (followUpQuestion.getName() === name) {
							return followUpQuestion;
						}
					}
				}
			}
		}
	}

	getFollowUpQuestionsByName(question, answers) {
		let result = [];

		for (const storedQuestion of this.getAll()) {
			if (storedQuestion.getName() === question) {
				for (const answer of storedQuestion.getAnswers()) {
					for (const givenAnswer of answers) {
						if (answer.getName() === givenAnswer) {
							for (const followUpQuestion of answer.getFollowUpQuestions()) {
								result.push (followUpQuestion);
							}
						}
					}
				}
			}
		}

		return result;
	}
};