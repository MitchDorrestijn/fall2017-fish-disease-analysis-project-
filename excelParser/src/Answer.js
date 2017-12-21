module.exports = class Answer {
	constructor(name, picture, symptoms, followUpQuestion) {
		this.name = name;
		this.picture = picture;
		this.symptoms = symptoms;
		this.followUpQuestions = followUpQuestion;
	}

	getName() {
		return this.name;
	}

	getFollowUpQuestions() {
		return this.followUpQuestions;
	}

	getFollowUpQuestionByName(name) {
		for (const elem of this.followUpQuestions) if (elem.getName()) return elem;
	}
};