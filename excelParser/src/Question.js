module.exports = class Question {
	constructor(name, answers) {
		this.name = name;
		this.answers = answers;
	}

	getName() {
		return this.name;
	}

	getAnswers() {
		return this.answers;
	}

	getAnswerByName(name) {
		for (const elem of this.answers) if (elem.getName() === name) return elem;
	}
};