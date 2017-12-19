const fs = require("fs");
const path = require("path");
const FileParser = require ("./FileParser");
const DiseaseSymptomContainer = require ("./DiseaseSymptomContainer");
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.json")));

const fileParser = new FileParser(config, 0);

const diseaseSymptomContainer = new DiseaseSymptomContainer (fileParser, config);

console.log (diseaseSymptomContainer.getByDiseaseName("Oodinium/Velvet disease"));
