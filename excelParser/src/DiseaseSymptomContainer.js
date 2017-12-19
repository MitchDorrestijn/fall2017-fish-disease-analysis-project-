const Disease = require("./Disease");
const DiseaseSymptom = require("./DiseaseSymptom");
const Symptom = require("./Symptom");

module.exports = class DiseaseSymptomContainer {
	constructor (fileParser, config) {
		this.fileParser = fileParser;
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

	getAll() {
		return this.diseaseSymptoms;
	}

	getByDiseaseName(name) {
		return this.diseaseSymptoms.filter ((elem) => {
			return elem.getDisease().getName() === name && elem.getScore() > 0;
		});
	}

	getBySymptomName(name) {
		return this.diseaseSymptoms.filter ((elem) => {
			return elem.getSymptom().getName() === name && elem.getScore() > 0;
		});
	}

	getByDiseaseAndSymptom(disease, symptom) {
		return this.diseaseSymptoms.filter ((elem) => {
			return (
				elem.getDisease().getName() === disease &&
				elem.getSymptom().getName() === symptom &&
				elem.getScore() > 0
			);
		});
	}
};