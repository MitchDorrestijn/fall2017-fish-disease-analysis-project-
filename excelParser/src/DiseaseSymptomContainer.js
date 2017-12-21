const Disease = require("./Disease");
const DiseaseSymptom = require("./DiseaseSymptom");
const Symptom = require("./Symptom");

module.exports = class DiseaseSymptomContainer {
	constructor (fileParser, config) {
		this.config = config;
		this.diseaseSymptoms = [];

		const {start: diseasesStart, end: diseasesEnd} = this.config.diseases;
		const {start: symptomsStart, end: symptomsEnd} = this.config.symptoms;
		const diseasesList = fileParser.getColumn (0, diseasesStart, diseasesEnd);
		const symptomsList = fileParser.getRow (0, symptomsStart, symptomsEnd);

		for (let i = 0; i < diseasesList.length; i++) {
			const disease = new Disease (diseasesList[i]);
			for (let j = 0; j < symptomsList.length; j++) {
				const symptom = new Symptom (symptomsList[j]);
				this.diseaseSymptoms.push(new DiseaseSymptom(disease, symptom, fileParser.getField (j+symptomsStart, i+diseasesStart)));
			}
		}
	}

	getAll(minScore) {
		return this.diseaseSymptoms.filter ((elem) => {
			return (elem.getScore() >= (minScore ? minScore : 0));
		});
	}

	getByDiseaseName(name, minScore) {
		return this.diseaseSymptoms.filter ((elem) => {
			return (
				elem.getDisease().getName() === name &&
				elem.getScore() >= (minScore ? minScore : 0)
			);
		});
	}

	getBySymptomName(name, minScore) {
		return this.diseaseSymptoms.filter ((elem) => {
			return (
				elem.getSymptom().getName() === name &&
				elem.getScore() >= (minScore ? minScore : 0)
			);
		});
	}

	getByDiseaseAndSymptomNames(disease, symptom, minScore) {
		return this.diseaseSymptoms.filter ((elem) => {
			return (
				elem.getDisease().getName() === disease &&
				elem.getSymptom().getName() === symptom &&
				elem.getScore() >= (minScore ? minScore : 0)
			);
		});
	}
};