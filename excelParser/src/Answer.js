module.exports = class Answer {
	constructor(name, picture, symptoms, followUpQuestion, directDiseases) {
		this.name = name;
		this.picture = picture;
		this.symptoms = symptoms;
		this.followUpQuestions = followUpQuestion;
		this.directDiseases = directDiseases;
	}

	getName() {
		return this.name;
	}

	getPictures() {
		return this.picture;
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
};