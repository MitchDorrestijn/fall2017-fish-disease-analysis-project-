module.exports = class Answer {
	constructor(name, picture, symptoms, directDiseases) {
		this.name = name;
		this.picture = picture ? picture : [];
		this.symptoms = symptoms;
		this.followUpQuestions = [];
		this.directDiseases = directDiseases;
	}

	getName() {
		return this.name;
	}

	getPictures() {
		return this.picture;
	}

	getSymptoms() {
		return this.symptoms;
	}

	getFollowUpQuestions() {
		return this.followUpQuestions;
	}

	getFollowUpQuestionByName(name) {
		for (const elem of this.followUpQuestions) if (name === elem.getName()) return elem;
	}

	getDirectDiseases() {
		return this.directDiseases;
	}

	getDirectDiseasesByName(name) {
		for (const elem of this.directDiseases) if (name === elem.getName()) return elem;
	}

	addFollowUpQuestion (followUpQuestion) {
		this.followUpQuestions.push(followUpQuestion);
	}
};