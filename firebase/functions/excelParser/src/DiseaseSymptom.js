module.exports = class DiseaseSymptom {
	constructor(disease, symptom, score) {
		this.disease = disease;
		this.symptom = symptom;
		this.score = score;
	}

	getDisease() {
		return this.disease;
	}

	getSymptom() {
		return this.symptom;
	}

	getScore() {
		return this.score;
	}

	addPoints(points) {
		this.score += points;
	}
};