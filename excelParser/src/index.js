const fs = require("fs");
const path = require("path");
const NodeXLSXFileParser = require("./NodeXLSXFileParser");
const DiseaseSymptomContainer = require("./DiseaseSymptomContainer");
const QuestionContainer = require("./QuestionContainer");
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.json")));

const diseaseSymptomContainer = new DiseaseSymptomContainer(new NodeXLSXFileParser(config.diseasesAndSymptoms), config.diseasesAndSymptoms);
const questionContainer = new QuestionContainer(new NodeXLSXFileParser(config.questions.questionAnswersAndSymptoms), new NodeXLSXFileParser(config.questions.questionsAndFollowUpQuestions), config.questions);

//diseaseSymptomContainer.getAll(1).forEach(elem => console.log(elem));
questionContainer.getAll().forEach(elem => console.log(elem.pictures));
//questionContainer.getFirstRoundQuestions().forEach(elem => console.log(elem));