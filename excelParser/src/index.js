const fs = require("fs");
const path = require("path");
const NodeXLSXFileParser = require("./NodeXLSXFileParser");
const DiseaseSymptomContainer = require("./DiseaseSymptomContainer");
const QuestionContainer = require("./QuestionContainer");
const Analysis = require("./Analysis");
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.json")));

const diseaseSymptomContainer = new DiseaseSymptomContainer(new NodeXLSXFileParser(config.diseasesAndSymptoms), config.diseasesAndSymptoms);
const questionContainer = new QuestionContainer(
	new NodeXLSXFileParser(config.questions.questionAnswersAndSymptoms),
	new NodeXLSXFileParser(config.questions.questionsAndFollowUpQuestions),
	config.questions
);

const voorbeeldAntwoord = [
	{
		question: "Select pictures that matches the symptoms on your fish (multiple possible)",
		answers: ["Black spot disease (mostly encapsulated worm larvae)"]
	},
	{
		question: 1,
		answers: ["Cotton growth"]
	}
];
const analysis = new Analysis(questionContainer, diseaseSymptomContainer);
analysis.getResults(voorbeeldAntwoord);

//diseaseSymptomContainer.getAll(1).forEach(elem => console.log(elem));
//questionContainer.getAll().forEach(elem => console.log(elem));
//console.log (JSON.stringify(analysis.getFirstQuestions()));
//questionContainer.getFirstRoundQuestions().forEach(elem => console.log(elem));
