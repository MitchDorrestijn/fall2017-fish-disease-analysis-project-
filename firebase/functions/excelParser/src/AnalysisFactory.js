const fs = require("fs");
const path = require("path");
const NodeXLSXFileParser = require("./NodeXLSXFileParser");
const DiseaseSymptomContainer = require("./DiseaseSymptomContainer");
const QuestionContainer = require("./QuestionContainer");
const Analysis = require("./Analysis");

module.exports = class AnalysisFactory {
	static _parseConfig(configPath) {
		return JSON.parse(fs.readFileSync(path.join(__dirname, "..", configPath)));
	}

	static _parseDiseaseSymptoms (config) {
		return new DiseaseSymptomContainer(
			new NodeXLSXFileParser(config.diseasesAndSymptoms),
			config.diseasesAndSymptoms
		);
	}

	static _parseQuestions (config) {
		return new QuestionContainer(
			new NodeXLSXFileParser(config.questions.questionAnswersAndSymptoms),
			new NodeXLSXFileParser(config.questions.questionsAndFollowUpQuestions),
			config.questions
		);
	}

	static _parseExcel(config) {
		return {
			diseaseSymptomContainer: AnalysisFactory._parseDiseaseSymptoms(config),
			questionContainer: AnalysisFactory._parseQuestions(config)
		};
	}

	static _createAnalysisInstance(parsers) {
		return new Analysis(
			parsers.questionContainer,
			parsers.diseaseSymptomContainer
		);
	}

	static getAnalysisWithCustomConfig(config) {
		console.log ("Parsing Excel sheets...");
		const parsers = AnalysisFactory._parseExcel(config);

		console.log ("Done");

		return AnalysisFactory._createAnalysisInstance(parsers);
	}

	static getAnalysis(configPath) {
		console.log("Parsing config...");
		const config = AnalysisFactory._parseConfig(configPath);

		console.log ("Parsing Excel sheets...");
		const parsers = AnalysisFactory._parseExcel(config);

		console.log ("Done");

		return AnalysisFactory._createAnalysisInstance(parsers);
	}
};