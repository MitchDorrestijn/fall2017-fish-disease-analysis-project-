/* 
 * Excel parser
 * Configuration is in config.json
 * - Sjoerd Scheffer
 */

const xlsx = require ("node-xlsx").default;
const fs = require ("fs");
const path = require ("path");
const config = JSON.parse (fs.readFileSync (path.join (__dirname, "../config.json")));
const file = fs.readFileSync (path.join (__dirname, "..", config.file));
const sheet = xlsx.parse (file);

const stripNewLines = (string) => {
	return string ? string.replace (/(\r\n|\n|\r)/gm, " ") : null;
};

const processArray = (array, start, end) => {
	// Removes all newlines and limit the array to either a field of a specific value, or an array index number.
	for (let i = 0; i < array.length; i++) {
		array [i] = stripNewLines (array [i]);
		if (array [i] === end || i === end) {
			return array.slice (start, i-1);
		}
	}
};

const getSymptoms = () => {
	let symptoms = sheet [0].data [0];
	const {start, end} = config.symptomsList;
	return symptoms;
	//return processArray (symptoms, start, end);
};

const getIllnesses = () => {
	const {start, end} = config.illnessesList;
	let illnesses = sheet [0].data.map ((elem) => {
		return elem [0];
	});
	return processArray (illnesses, start, end);
};

console.log ("\n@@ Symptomen");
console.log (getSymptoms ());
console.log ("\n@@ Ziektes");
console.log (getIllnesses ());
