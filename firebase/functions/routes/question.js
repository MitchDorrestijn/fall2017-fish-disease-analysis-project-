const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const fs = require('fs');

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');
const validate = require('../middleware/validate.js');

const db = admin.firestore();
const bucket = admin.storage().bucket();

let symptomenEnZiektesPath = path.join(os.tmpdir(), 'symptomenEnZiektes.xlsx');
let kruisjes_path;

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

router.get('/question/excel/:fname', (req, res) => {
    getsymptomenEnZiektesContent(req.params.fname, req.query.force).then((contents) => {
        res.send(contents);
    })
    .catch((err) => {
        res.status(500).send(err.message);
    })
})

module.exports = router;
