/*
 * Analyse black magic
 * - Sjoerd Scheffer
 *
 * Alle paths zijn relatief aan de excelParser directory (dus eentje hoger dan deze directory).
 * Dit geldt ook voor de bestandsnamen in de config file.
 */

const analysisFactory = require("./AnalysisFactory");
const voorbeeldAntwoord = [
	{
		question: "Select pictures that matches the symptoms on your fish (multiple possible)",
		answers: ["Oodinium/Velvet disease"]
	},
	{
		question: 15,
		answers: ["Fungus (mostly Saprolegnia)"]
	}
];

const analysis = analysisFactory.getAnalysis("config.json");

console.log(analysis.getResults(voorbeeldAntwoord));
console.log(analysis.getNextQuestions(voorbeeldAntwoord)[0]);
