const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const fs = require('fs');

const AnalysisFactory = require('../excelParser/src/AnalysisFactory');

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');
const validate = require('../middleware/validate.js');

const db = admin.firestore();
const bucket = admin.storage().bucket();

let symptomenEnZiektesPath = path.join(os.tmpdir(), 'symptomenEnZiektes.xlsx');
let kruisjes_path;
let analysis;

const voorbeeldAntwoord = [
	{
		question: "Select pictures that matches the symptoms on your fish (multiple possible)",
		answers: ["White grub disease (encapsulated worm larvae, NO ICH)"]
	},
	{
		question: 1,
		answers: ["Cotton growth"]
	}
];

const getExcelFileLocalPath = (fileName) => {
    return path.join(os.tmpdir(), fileName + '.xlsx');
}

const getExcelFileRemotePath = (fileName) => {
    return '/excel/' + fileName + '.xlsx';
}

const getExcelFile = (fileName, force) => {
    const localPath = getExcelFileLocalPath(fileName);
    if (fs.existsSync(localPath) && !force) {
        console.log('Getting file ' + fileName + ' from local file system.');
        return Promise.resolve(fs.readFileSync(localPath));
    }

    console.log('File ' + fileName + ' not in memory, downloading it.');
    return bucket.file(getExcelFileRemotePath(fileName)).download({
        destination: getExcelFileLocalPath(fileName)
    }).then(() => {
        return Promise.resolve(fs.readFileSync(getExcelFileLocalPath(fileName)));
    })
}

const p1 = getExcelFile('symptomenEnZiektes');
const p2 = getExcelFile('Vraagziektekruisjes');

// First download files, then call the shit.
Promise.all([p1, p2]).then(() => {
    let config = AnalysisFactory._parseConfig('config.json');
    config.diseasesAndSymptoms.file = getExcelFileLocalPath('symptomenEnZiektes');
    config.questions.questionsAndFollowUpQuestions.file = getExcelFileLocalPath('Vraagziektekruisjes');
    config.questions.questionAnswersAndSymptoms.file = getExcelFileLocalPath('Vraagziektekruisjes');
    analysis = AnalysisFactory.getAnalysisWithCustomConfig(config);

    //console.log(analysis.getResults(voorbeeldAntwoord));
    //console.log(analysis.getNextQuestions(voorbeeldAntwoord)[0]);
}).catch((err) => {
    console.log(err);
})

router.get('/questions/shallow', (req, res) => {
    res.send(analysis.getFirstQuestions());
});

router.post('/questions/deep', (req, res) => {
    if(!req.body.answers){
        return res.status(400).send('Please send answers');
    }
    res.send(analysis.getNextQuestions(req.body.answers));
});

router.post('/questions/results', (req, res) => {
    if(!req.body.answers){
        return res.status(400).send('Please send answers');
    }
    res.send(analysis.getResults(req.body.answers));
});

module.exports = router;
