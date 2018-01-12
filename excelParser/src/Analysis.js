module.exports = class Analysis {
	constructor(questionContainer, diseaseSymptomContainer) {
		this.questionContainer = questionContainer;
		this.diseaseSymptomContainer = diseaseSymptomContainer;
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
						result[i].addPoints(symptomDiseaseSymptom.getScore());
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
			return {
				disease: elem.getDisease().getName(),
				score: elem.getScore()
			};
		}).sort((a, b) => a.score > b.score ? -1 : 1);
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
		let symptoms = Analysis._convertAnswersToDiseaseSymptoms(answers, this.questionContainer);
		let diseaseSymptoms = Analysis._convertDiseaseSymptomsToDiseaseScores(symptoms, this.diseaseSymptomContainer);
		let directDiseases = [];

		for (const answer of answers) {
			for (const questionAnswer of this.questionContainer.getQuestionByName(answer.question).getAnswers()) {
				if (questionAnswer.getDirectDiseases().length > 0) {
					directDiseases.push(questionAnswer.getDirectDiseases().map(elem => {
						return {
							disease: elem.getName()
						};
					})[0]);
				}
			}
		}

		directDiseases = directDiseases.sort((a, b) => a.disease > b.disease ? -1 : 1);
		for (const elem of directDiseases) {
			diseaseSymptoms.unshift(elem);
		}

		for (let i = 0; i < diseaseSymptoms.length; i++) {
			if (!diseaseSymptoms[i].hasOwnProperty("score")) {
				for (let j = i+1; j < diseaseSymptoms.length; j++) {
					if (
						diseaseSymptoms[j].disease === diseaseSymptoms[i].disease &&
						diseaseSymptoms[j].hasOwnProperty("score")
					) {
						diseaseSymptoms.splice (j, 1);
						j--;
					}
				}
			}
		}

		return diseaseSymptoms;
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
	}
};