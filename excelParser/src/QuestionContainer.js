const Question = require("./Question");
const Answer = require("./Answer");
const Symptom = require("./Symptom");
const Disease = require("./Disease");

module.exports = class QuestionContainer {
	constructor(fileParserQuestions, fileParserFollowUpQuestions, config) {
		this.config = config;
		this.questions = QuestionContainer._addFollowUpQuestions(
			QuestionContainer._fillQuestions(
				fileParserQuestions,
				config
			),
			fileParserFollowUpQuestions,
			config
		);
	}

	static _addFollowUpQuestions(questions, fileParser, config) {
		return questions;
	}

	static _fillQuestions(fileParser, config) {
		const {start: questionsStart, end: questionsEnd} = config.questionAnswersAndSymptoms.questions;
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
							null, //followUpQuestions
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

	getFirstRoundQuestions() {
		return this.questions.filter (a => {
			return a.getAnswers().filter (b => {
				return (b.getFollowUpQuestions());
			}).length > 0;
		});
	}

	getQuestionByName(name) {
		for (const elem of this.questions) if (elem.name === name) return elem;
	}
};