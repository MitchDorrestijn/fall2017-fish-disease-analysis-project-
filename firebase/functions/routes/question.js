const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const fs = require('fs');

const AnalysisFactory = require('../excelParser/src/AnalysisFactory');

/* Helper functions */
const helperFunctions = require('../middleware/functions.js');

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');
const validate = require('../middleware/validate.js');

const db = admin.firestore();
const bucket = admin.storage().bucket();

let symptomenEnZiektesPath = path.join(os.tmpdir(), 'symptomenEnZiektes.xlsx');
let kruisjes_path;
let analysis;

const getExcelFileLocalPath = (fileName) => {
    return path.join(os.tmpdir(), fileName + '.xlsx');
}

const getExcelFileRemotePath = (fileName) => {
    return '/excel/' + fileName + '.xlsx';
}

const fileExists = (fileName) => {
    return new Promise ((resolve, reject) => {
        fs.access (getExcelFileLocalPath(fileName), fs.constants.R_OK, (err) => {
            if (err) {
                resolve(false);
            } else {
                const stats = fs.statSync(getExcelFileLocalPath(fileName));
                resolve(!stats.size == 0);
            }
        });
    });
}

const getExcelFile = (fileName, force) => {
    const localPath = getExcelFileLocalPath(fileName);

    return fileExists(fileName).then((exists) => {
        if (!force && exists) {
            console.log('Getting file ' + fileName + ' from local file system: ' + localPath + '.');

            return Promise.resolve(fs.readFileSync(localPath));
        } else {
            console.log('File ' + fileName + ' not in memory, downloading it.');
            
            return bucket.file(getExcelFileRemotePath(fileName)).download({
                destination: localPath
            }).then(() => {
                return Promise.resolve(fs.readFileSync(localPath));
            }).catch((err) => {
               return Promise.reject(err);
               console.log(err);
            });
        }
    }).catch((err) => {
        console.log(err);
    });
}

const p1 = getExcelFile('symptomenEnZiektes');
const p2 = getExcelFile('Vraagziektekruisjes');

const initAnalysis = () => {
    let config = AnalysisFactory._parseConfig('config.json');
    config.diseasesAndSymptoms.file = getExcelFileLocalPath('symptomenEnZiektes');
    config.questions.questionsAndFollowUpQuestions.file = getExcelFileLocalPath('Vraagziektekruisjes');
    config.questions.questionAnswersAndSymptoms.file = getExcelFileLocalPath('Vraagziektekruisjes');
    analysis = AnalysisFactory.getAnalysisWithCustomConfig(config);
}

// First download files, then call the shit.
const loadingIsReady = Promise.all([p1, p2]).then(() => {
    initAnalysis();
}).catch((err) => {
    console.log(err);
})

router.get('/questions/shallow', (req, res) => {
    loadingIsReady.then(() => {
        res.send(analysis.getFirstQuestions());
    }).catch((err) => {
        res.status(500).send(err.message);
    })
});

router.get('/questions/refresh', (req, res) => {
    const p1 = getExcelFile('symptomenEnZiektes', true);
    const p2 = getExcelFile('Vraagziektekruisjes', true);

    Promise.all([p1, p2]).then(() => {
        initAnalysis();
        res.send('Cache cleared');
    }).catch((err) => {
        res.status(400).send(err.message);
    });
});

router.post('/questions/deep', (req, res) => {
    if(!req.body.answers){
        return res.status(400).send('Please send answers');
    }

    loadingIsReady.then(() => {
        res.send(analysis.getNextQuestions(req.body.answers));
    }).catch((err) => {
        res.status(500).send(err.message);
    })
});

router.post('/questions/results', (req, res) => {
    if(!req.body.answers){
        return res.status(400).send('Please send answers');
    }

    let results;
    
    loadingIsReady.then(() => {
        results = analysis.getResults(req.body.answers);
        let promises = [];

        results.forEach((result) => {
            promises.push(
                db.collection('diseases').where('code', '==', result.diseaseCode).get()
                .then((snapshot) => {
                    if(snapshot.docs[0]){
                        result.details = snapshot.docs[0].data();
                    }
                })
            );
        })

        return Promise.all(promises);
    }).then(() => {
        res.send(results);
    }).catch((err) => {
        res.status(500).send(err.message);
    })
});

module.exports = router;
