const fs = require("fs");
const path = require("path");
const NodeXLSXFileParser = require("./NodeXLSXFileParser");
const DiseaseSymptomContainer = require("./DiseaseSymptomContainer");
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.json")));

const fileParser = new NodeXLSXFileParser(config.diseasesAndSymptoms, 0);

const diseaseSymptomContainer = new DiseaseSymptomContainer (fileParser, config.diseasesAndSymptoms);

diseaseSymptomContainer.getAll().forEach(elem => console.log (elem));