const Question = require("./Question");
const Answer = require("./Answer");
const Symptom = require("./Symptom");

module.exports = class QuestionContainer {
	constructor(fileParser, config) {
		this.config = config;
		this.questions = QuestionContainer._fillQuestions(fileParser, config);
		for (let elem of this.questions) {
			console.log (elem);
		}
	}

	static _fillQuestions(fileParser, config) {
		const {start: questionsStart, end: questionsEnd} = config.questionAnswersAndSymptoms.questions;
		const {start: symptomsStart, end: symptomsEnd} = config.questionAnswersAndSymptoms.symptoms;
		let questions = [];
		for (let i = questionsStart; !(fileParser.getField(1, i) === undefined && fileParser.getField(2, i+1) === undefined); i++) {
			// Gaat door de hele lijst heen tot dat er gee vragen+antwoorden meer zijn.
			if (fileParser.getField(1, i) !== undefined) {
				let answers = [];
				for (let j = 1; fileParser.getField(2, i+j) !== undefined; j++) {
					// Gaat door alle antwoorden van de vraag heen
					let symptoms = [];
					for (let k = symptomsStart; fileParser.getField(k, 0) !== undefined; k++) {
						// Gaat door alle vakjes van de symptomen van de antwoorden heen
						if (fileParser.getField(k, i+j) === 'x') {
							symptoms.push(new Symptom(fileParser.getField(k, 0)));
						}
					}
					let pictures = fileParser.getField(3, i+j);
					pictures = pictures ? pictures.split(/;/g).filter(elem => elem !== " ").map(elem => elem.trim()) : pictures;
					answers.push(
						new Answer(
							fileParser.getField(2, i+j), // naam
							pictures, // foto
							symptoms
						)
					);
				}
				questions.push(new Question(fileParser.getField(1, i), answers));
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