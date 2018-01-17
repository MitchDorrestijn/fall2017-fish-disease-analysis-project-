const Disease = require("./Disease");
const DiseaseSymptom = require("./DiseaseSymptom");
const Symptom = require("./Symptom");

module.exports = class DiseaseSymptomContainer {
	constructor (fileParser, config) {
		this.config = config;
		this.diseaseSymptoms = DiseaseSymptomContainer._fillDiseaseSymptoms(fileParser, config);
	}

	static _getDiseasesList(fileParser, config) {
		// Haal alle ziektes uit de excel sheet op totdat er een witregel komt
		const {start} = config.diseases;
		let result = [];

		for (let i = start; fileParser.getField(0, i) !== undefined; i++) {
			result.push(fileParser.getField(0, i));
		}

		return result;
	}

	static _fillDiseaseSymptoms(fileParser, config) {
		// Zet de symptomen en ziektes om in objecten.
		const {start: diseasesStart} = config.diseases;
		const {start: symptomsStart, end: symptomsEnd} = config.symptoms;
		const diseasesList = DiseaseSymptomContainer._getDiseasesList(fileParser, config);
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

	getByDiseaseAndSymptomNames(disease, symptom) {
		return this.diseaseSymptoms.filter (elem => {
			return (
				elem.getDisease().getName() === disease &&
				elem.getSymptom().getName() === symptom
			);
		})[0];
	}
};