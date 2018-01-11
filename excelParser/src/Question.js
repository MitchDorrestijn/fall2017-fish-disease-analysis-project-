module.exports = class Question {
	constructor(name, pictures, answers) {
		this.name = name;
		this.pictures = pictures ? pictures : [];
		this.answers = answers;
	}

	getName() {
		return this.name;
	}

	getAnswers() {
		return this.answers;
	}

	getPictures() {
		return this.pictures;
	}

	getAnswerByName(name) {
		for (const elem of this.answers) if (elem.getName() === name) return elem;
	}
};