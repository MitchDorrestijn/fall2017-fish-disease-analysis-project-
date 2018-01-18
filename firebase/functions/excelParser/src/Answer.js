const firebase = require("firebase-admin");

module.exports = class Answer {
	_getPictureURLs() {
		for (const bucket of this.buckets) {
			this.promises.push(
				bucket.promise.makePublic()
				.then(() => {
					return bucket.promise.getSignedUrl({
						action: 'read',
						expires: '03-09-2491'
					})
				})
				.then(signedUrls => {
					const url = signedUrls[0];
					for (let i = 0; i < this.picture.length; i++) {
						if (this.picture[i] === bucket.pictureName) {
							this.picture[i] = url;
						}
					}
					return Promise.resolve();
				})
				.catch((err) => {
					console.log(bucket.pictureName + ": " + err.message);
				})
			);
		}
	}

	constructor(name, picture, symptoms, directDiseases) {
		if (picture) {
			this.buckets = picture.map(elem => {
				return {
					promise: firebase.storage().bucket().file("images/analyse/"+elem),
					pictureName: elem
				};
			});
		} else {
			this.buckets = [];
		}
		this.promises = [];
		this.name = name;
		this.picture = picture ? picture : [];
		this.symptoms = symptoms;
		this.followUpQuestions = [];
		this.directDiseases = directDiseases;
		this._getPictureURLs();
	}

	getAllPromises() {
		return this.promises;
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