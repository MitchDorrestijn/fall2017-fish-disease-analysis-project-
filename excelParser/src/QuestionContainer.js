const Question = require("./Question");
const Answer = require("./Answer");
const Symptom = require("./Symptom");

module.exports = class QuestionContainer {
	constructor(fileParser, config) {
		this.config = config;
		this.questions = QuestionContainer._fillQuestions(fileParser, config);
		for (const elem of this.questions) {
			console.log (elem);
		}
	}

	static _fillQuestions(fileParser, config) {
		const {start: questionsStart, end: questionsEnd} = config.questionAnswersAndSymptoms.questions;
		const {start: symptomsStart, end: symptomsEnd} = config.questionAnswersAndSymptoms.symptoms;
		const {
			questionsColumn,
			answersColumn,
			answersYOffset,
			picturesColumn,
			symptomsRow,
			symptomMarker
		} = config.questionAnswersAndSymptoms;

		let questions = [];
		for (
			let i = questionsStart;
			!(
				fileParser.getField(questionsColumn, i) === undefined &&
				fileParser.getField(answersColumn, i) === undefined
			);
			i++
		) {
			// Gaat door de hele lijst heen tot dat er gee vragen+antwoorden meer zijn.
			if (fileParser.getField(questionsColumn, i) !== undefined) {
				let answers = [];
				for (let j = answersYOffset; fileParser.getField(answersColumn, i+j) !== undefined; j++) {
					// Gaat door alle antwoorden van de vraag heen
					let symptoms = [];
					for (let k = symptomsStart; fileParser.getField(k, symptomsRow) !== undefined; k++) {
						// Gaat door alle vakjes van de symptomen van de antwoorden heen
						if (fileParser.getField(k, i+j) === symptomMarker) {
							symptoms.push(new Symptom(fileParser.getField(k, symptomsRow)));
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
							symptoms
						)
					);
				}
				if (answers.length > 0) {
					// Vragen zonder antwoorden worden niet opgeslagen.
					questions.push(new Question(fileParser.getField(questionsColumn, i), answers));
				}
			}
		}
		return questions;
	}

	getAllQuestions() {
		return this.questions;
	}

	getQuestionByName(name) {
		for (const elem of this.questions) if (elem.name === name) return elem;
	}
};