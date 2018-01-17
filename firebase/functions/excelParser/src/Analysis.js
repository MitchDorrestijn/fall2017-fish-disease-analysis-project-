module.exports = class Analysis {
	constructor(questionContainer, diseaseSymptomContainer) {
		this.questionContainer = questionContainer;
		this.diseaseSymptomContainer = diseaseSymptomContainer;
	}

	static _removeArrayDoubles(array, property) {
		let result = array;

		for (let i = 0; i < result.length; i++) {
			for (let j = i+1; j < result.length; j++) {
				if (property) {
					// Controleer alleen of een specifieke property gelijk is
					if (result[i][property] === result[j][property]) {
						result.splice(j, 1);
						j--;
					}
				} else {
					if (result[i] === result[j]) {
						result.splice(j, 1);
						j--;
					}
				}
			}
		}

		return result;
	}

	static _convertAnswersToDiseaseSymptoms(answers, questionContainer) {
		// Zet de gegeven antwoorden om in bijbehorende symptomen
		let result = [];

		for (const answer of answers) {
			const question = questionContainer.getQuestionByName(answer.question);
			for (const questionAnswer of question.getAnswers()) {
				for (const answerAnswer of answer.answers) {
					if (answerAnswer === questionAnswer.getName()) {
						questionAnswer.getSymptoms().forEach(elem => result.push(elem));
					}
				}
			}
		}

		return result;
	}

	static _convertDiseaseSymptomsToDiseaseScores(symptoms, diseaseSymptomContainer) {
		// Haal de scores van de ziektes op
		let result = [];

		for (const symptom of symptoms) {
			let symptomDiseaseSymptoms = diseaseSymptomContainer.getBySymptomName(symptom.getName());
			for (const symptomDiseaseSymptom of symptomDiseaseSymptoms) {
				let found = false;
				for (let i = 0; i < result.length; i++) {
					if (
						symptomDiseaseSymptom.getDisease().getName() === result[i].getDisease().getName() &&
						result[i].getScore() > 0
					) {
						result[i].addPoints(
							diseaseSymptomContainer.getByDiseaseAndSymptomNames(
								symptomDiseaseSymptom.getDisease().getName(),
								symptomDiseaseSymptom.getSymptom().getName()
							).getScore()
						);
						found = true;
					}
				}
				if (!found && symptomDiseaseSymptom.getScore() > 0) {
					result.push(symptomDiseaseSymptom);
				}
			}
		}

		// Zet om naar standaard JavaScript object, gesorteerd op score (aflopend)
		return result.map(elem => {
			if (elem.getDisease().getCode()) {
				return {
					disease: elem.getDisease().getName(),
					diseaseCode: elem.getDisease().getCode(),
					score: elem.getScore()
				};
			} else {
				return {
					disease: elem.getDisease().getName(),
					score: elem.getScore()
				};
			}
		}).sort((a, b) => a.score > b.score ? -1 : 1);
	}

	static _addDirectDiseases (answers, diseaseSymptoms, questionContainer, diseaseSymptomContainer) {
		let directDiseases = [];
		let result = diseaseSymptoms;

		for (const answer of answers) {
			for (const questionAnswer of questionContainer.getQuestionByName(answer.question).getAnswers()) {
				if (questionAnswer.getDirectDiseases().length > 0) {
					directDiseases.push(questionAnswer.getDirectDiseases().map(elem => {
						const diseaseCode = diseaseSymptomContainer
						.getByDiseaseName(elem.getName())[0]
						.getDisease()
						.getCode();
						if (diseaseCode) {
							return {
								disease: elem.getName(),
								diseaseCode: diseaseCode
							};
						} else {
							return {
								disease: elem.getName()
							};
						}
					})[0]);
				}
			}
		}

		directDiseases = Analysis._removeArrayDoubles(
			directDiseases.sort((a, b) => a.disease > b.disease ? -1 : 1),
			"disease"
		);

		for (const elem of directDiseases) {
			result.unshift(elem);
		}

		for (let i = 0; i < result.length; i++) {
			if (!result[i].hasOwnProperty("score")) {
				for (let j = i+1; j < result.length; j++) {
					if (
						result[j].disease === result[i].disease &&
						result[j].hasOwnProperty("score")
					) {
						result.splice (j, 1);
						j--;
					}
				}
			}
		}

		return result;
	}

	getFirstQuestions() {
		return this.questionContainer.getAll().map (elem => {
			return {
				name: elem.getName(),
				pictures: elem.getPictures(),
				answers: elem.getAnswers().map (elem2 => {
					return {
						name: elem2.getName(),
						pictures: elem2.getPictures()
					};
				})
			};
		});
	}

	getResults(answers) {
		return Analysis._addDirectDiseases(
			answers,
			Analysis._convertDiseaseSymptomsToDiseaseScores(
				Analysis._convertAnswersToDiseaseSymptoms(
					answers,
					this.questionContainer
				),
				this.diseaseSymptomContainer
			),
			this.questionContainer,
			this.diseaseSymptomContainer
		);
	}

	getResultsAsPercentage(answers) {
		// Geeft per ziekte het percentage van de totaal uitgedeelde punten terug
		const scoreResults = this.getResults(answers);
		let result = [];
		let totalScores = 0;

		for (const elem of scoreResults) {
			totalScores += elem.score;
		}

		for (let i = 0; i < scoreResults.length; i++) {
			result.push(scoreResults[i]);
			scoreResults[i].score = 100 / totalScores * scoreResults[i].score;
		}

		return result;
	}

	getNextQuestions(answers) {
		let result = [];

		for (const answer of answers) {
			const followUpQuestions = this.questionContainer.getFollowUpQuestionsByName(answer.question, answer.answers).map(elem => {
				return {
					name: elem.getName(),
					pictures: elem.getPictures(),
					answers: elem.getAnswers().map(elem2 => {
						return {
							name: elem2.getName(),
							pictures: elem2.getPictures()
						}
					})
				}
			});
			for (const followUpQuestion of followUpQuestions) {
				result.push(followUpQuestion);
			}
		}

		return Analysis._removeArrayDoubles(result);
	}
};