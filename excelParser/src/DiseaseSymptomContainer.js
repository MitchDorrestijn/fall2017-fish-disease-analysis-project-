const Disease = require("./Disease");
const DiseaseSymptom = require("./DiseaseSymptom");
const Symptom = require("./Symptom");

module.exports = class DiseaseSymptomContainer {
	constructor (fileParser, config) {
		this.config = config;
		this.diseaseSymptoms = DiseaseSymptomContainer._fillDiseaseSymptoms(fileParser, config);
	}

	static _fillDiseaseSymptoms(fileParser, config) {
		const {start: diseasesStart, end: diseasesEnd} = config.diseases;
		const {start: symptomsStart, end: symptomsEnd} = config.symptoms;
		const diseasesList = fileParser.getColumn (0, diseasesStart, diseasesEnd);
		const symptomsList = fileParser.getRow (0, symptomsStart, symptomsEnd);
		let diseaseSymptoms = [];

		for (let i = 0; i < diseasesList.length; i++) {
			for (let j = 0; j < symptomsList.length; j++) {
				diseaseSymptoms.push(
					new DiseaseSymptom(
						new Disease(diseasesList[i]),
						new Symptom(symptomsList[j]),
						fileParser.getField (j+symptomsStart, i+diseasesStart)
					)
				);
			}
		}

		return diseaseSymptoms;
	}

	getAll() {
		return this.diseaseSymptoms;
	}

	getByDiseaseName(name) {
		return this.diseaseSymptoms.filter (elem => elem.getDisease().getName() === name);
	}

	getBySymptomName(name) {
		return this.diseaseSymptoms.filter (elem => elem.getSymptom().getName() === name);
	}

	getByDiseaseAndSymptomNames(disease, symptom, minScore) {
		return this.diseaseSymptoms.filter (elem => {
			return (
				elem.getDisease().getName() === disease &&
				elem.getSymptom().getName() === symptom
			);
		});
	}
};