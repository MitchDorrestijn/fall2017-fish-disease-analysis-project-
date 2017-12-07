const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const gcs = require('@google-cloud/storage');
const algoliasearch = require('algoliasearch');

/* Algolia */
const ALGOLIA_ID = "WPBUCLWL7Y";
const ALGOLIA_ADMIN_KEY = "e587aaec3eec56edbf94efc42315ca9d";
const ALGOLIA_INDEX_NAME = "notes";
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');
const validateModel = require('../middleware/validateModel.js');

const multer  = require('multer');
const upload = multer();

/* Shortcuts */
const db = admin.firestore();
const bucket = admin.storage().bucket();

/* Model Definition */
const model = {
    name: "species",
    endpoint: "species",
    keys: ["name", "info", "additional", "picture"]
}

router.get('/' + model.endpoint, isAuthenticated, (req, res) => {
    db.collection(model.endpoint).get()
    .then((snapshot) => {
        let array = [];
        snapshot.docs.forEach((doc) => {
            array.push(doc.data());
        })
        res.send(array);
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

router.post('/' + model.endpoint, isAuthenticated, validateModel(model.name, model.keys), (req, res) => {
    let promise = new Promise((resolve) => {
        resolve();
    });

    if(req.body[model.name].image){
        promise = uploadImage(req.body[model.name].image);
    }

    promise()
    .then((result) => {
        if(result.imageUrl){
            req.body[model.name].imageUrl = result.imageUrl;
        }
        return db.collection(model.endpoint).add(req.body[model.name]);
    })
    .then((newDoc) => {
        return newDoc.get()
    })
    .then((document) => {
        res.status(201).send(document.data());
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

router.post('/' + model.endpoint + '/:id/upload', isAdmin, upload.single('image'), (req, res) => {
    if(!req.file){
        res.status(400).send("No image provided");
    }
    const gcsname = 'species/' + req.params.id + '/' + Date.now() + req.file.originalname;
    const file = bucket.file(gcsname);

    let url = "";

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    });
  
    stream.on('error', (err) => {
        res.sendStatus(500);
    });
  
    stream.on('finish', () => {
        file.makePublic()
        .then(() => {
            return file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            })
        })
        .then(signedUrls => {
            console.log(url);
            url = signedUrls[0];

            return db.collection(model.endpoint).doc(req.params.id).set({
                imageUrl: url
            }, { merge: true })
        })
        .then(() => {
            res.status(200).send(url);
        })
        .catch((err) => {
            res.status(500).send(err.message);
        })
    });
  
    stream.end(req.file.buffer);
})

const uploadImage = (base64string) => {
    return new Promise((resolve, reject) => {
        const gcsname = Date.now() + req.file.originalname;
        const file = bucket.file(gcsname);
      
        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });
      
        stream.on('error', (err) => {
            req.file.cloudStorageError = err;
            reject(err);
        });
      
        stream.on('finish', () => {
            req.file.cloudStorageObject = gcsname;
            file.makePublic().then(() => {
                req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
                resolve();
            });
        });
      
        stream.end(req.file.buffer);
    });
}

router.put('/' + model.endpoint + '/:id', isAuthenticated, validateModel(model.name, model.keys), (req, res) => {
    db.collection(model.endpoint).doc(req.params.id).update(req.body[model.name])
    .then(() => {
        res.status(200).send();
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

router.delete('/' + model.endpoint + '/:id', isAuthenticated, (req, res) => {
    db.collection(model.endpoint).doc(req.params.id).delete()
    .then(() => {
        res.sendStatus(200);
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

router.get('/' + model.endpoint + '/search', isAuthenticated, (req, res) => {
    const index = client.initIndex(model.endpoint);
    const query = req.query.term;

    if(!query){
        return res.status(400).send("Please provide '?term=searchterm' in url");
    }

    index
    .search({
        query
    })
    .then(responses => {
        res.send(responses.hits);
    });
})

router.get('/' + model.endpoint + '/:id', isAuthenticated, (req, res) => {
    db.collection(model.endpoint).doc(req.params.id).get()
    .then((doc) => {
        res.send(doc.data());
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

module.exports = router;
