module.exports = class Analysis {
	constructor(questionContainer, diseaseSymptomContainer) {
		this.questionContainer = questionContainer;
		this.diseaseSymptomContainer = diseaseSymptomContainer;
	}

	getFirstQuestions() {
		return this.questionContainer.getAll().map ((elem) => {
			return {
				name: elem.getName(),
				pictures: elem.getPictures(),
				answers: elem.getAnswers().map ((elem2) => {
					return {
						name: elem2.getName(),
						pictures: elem2.getPictures()
					};
				})
			};
		});
	}

	getResults(answers) {
		let diseaseSymptoms = [];
		let symptoms = [];

		for (const answer of answers) {
			const question = this.questionContainer.getQuestionByName(answer.question);
			for (const questionAnswer of question.getAnswers()) {
				for (const answerAnswer of answer.answers) {
					if (answerAnswer === questionAnswer.getName()) {
						questionAnswer.getSymptoms().forEach((elem) => symptoms.push(elem));
					}
				}
			}
		}

		console.log (symptoms);

		for (const symptom of symptoms) {
			let symptomDiseaseSymptoms = this.diseaseSymptomContainer.getBySymptomName(symptom.getName());
			for (const symptomDiseaseSymptom of symptomDiseaseSymptoms) {
				let found = false;
				for (let i = 0; i < diseaseSymptoms.length; i++) {
					if (
						symptomDiseaseSymptom.getDisease().getName() === diseaseSymptoms[i].getDisease().getName() &&
						diseaseSymptoms[i].getScore() > 0
					) {
						diseaseSymptoms[i].addPoints(symptomDiseaseSymptom.getScore());
						found = true;
					}
				}
				if (!found && symptomDiseaseSymptom.getScore() > 0) {
					diseaseSymptoms.push(symptomDiseaseSymptom);
				}
			}
		}

		diseaseSymptoms = diseaseSymptoms.map((elem) => {
			return {
				disease: elem.getDisease().getName(),
				score: elem.getScore()
			};
		});

		console.log (diseaseSymptoms);
	}

	getNextQuestions(answers) {
	}
};