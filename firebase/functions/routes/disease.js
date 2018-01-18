const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');
const Joi = require('joi');
const Busboy = require("busboy");

/* Algolia */
const ALGOLIA_ID = "WPBUCLWL7Y";
const ALGOLIA_ADMIN_KEY = "e587aaec3eec56edbf94efc42315ca9d";
const ALGOLIA_INDEX_NAME = "notes";
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

/* Middleware */
const isAuthenticated = require('../middleware/isAuthenticated.js');
const validateModel = require('../middleware/validateModel.js');
const validate = require('../middleware/validate.js');
const isAdmin = require('../middleware/isAdmin.js');

const multer  = require('multer');
const upload = multer();

const db = admin.firestore();
const bucket = admin.storage().bucket();

/* Model Definition */
const model = {
    name: "disease",
    endpoint: "diseases",
    keys: ["name", "symptoms", "description", "treatment"],
    schema: Joi.object().keys({
        name: Joi.string().min(3).max(200).required(),
        id: Joi.string().alphanum(),
        symptoms: Joi.array(),
        description: Joi.string(),
        treatment: Joi.string(),
        code: Joi.string()
    })
};

/*
    Fish disease model:
    - name,
    - symptoms,
    - description,
    - treatment
*/

router.get('/' + model.endpoint, isAuthenticated, (req, res) => {
    db.collection(model.endpoint).get()
    .then((snapshot) => {
        let array = [];
        snapshot.docs.forEach((doc) => {
            let o = doc.data();
            o.id = doc.id;
            array.push(o);
        })
        res.send(array);
    })
    .catch((error) => {
        res.status(500).send(error.message);
    })
})

router.post('/' + model.endpoint, isAuthenticated, validate(model.name, model.schema), (req, res) => {
    db.collection(model.endpoint).add(req.body[model.name])
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

router.put('/' + model.endpoint + '/:id', isAuthenticated, validate(model.name, model.schema), (req, res) => {
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

router.post('/' + model.endpoint + '/:id/upload', isAdmin, upload.single('image'), (req, res) => {
    if(req.file){
        return uploadViaMulter(req, req.params.id).then(() => {
            res.send('success');
        });
    } else if (req.rawBody) {
        return uploadViaBusboy(req.rawBody, req).then(() => {
            res.send('success');
        });
    } else {
        return res.status(400).send('No image provided');
    }
})

const uploadViaBusboy = (image, req) => {
    return new Promise((resolve, reject) => {
        const busboy = new Busboy({ headers: req.headers });

        // This callback will be invoked for each file uploaded
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            let url;
            let gcsname = 'diseases/' + req.params.id + '/' + Date.now() + filename;
            const bucketfile = bucket.file(gcsname);

            const stream = bucketfile.createWriteStream({
                metadata: {
                    contentType: mimetype
                }
            });

            stream.on('finish', () => {
                return bucketfile.makePublic()
                .then(() => {
                    return bucketfile.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    })
                })
                .then(signedUrls => {
                    url = signedUrls[0];
        
                    return db.collection(model.endpoint).doc(req.params.id).set({
                        imageUrl: url
                    }, { merge: true })
                })
                .then(() => {
                    return resolve(url);
                })
                .catch((err) => {
                    return reject(err.message);
                })
            });

            stream.on('error', (err) => {
                return reject(err.message)
            });

            file.pipe(stream);
        });

        busboy.on('finish', () => {
            //resolve('success');
        })

        // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
        // a callback when it's finished.
        busboy.end(req.rawBody);
    });
}

const uploadViaMulter = (req, id) => {
    return new Promise((resolve, reject) => {
        let gcsname = 'species/' + req.params.id + '/' + Date.now() + req.file.originalname;
        const file = bucket.file(gcsname);

        let url = "";

        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

        stream.on('error', (err) => {
            reject(err.message);
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
                url = signedUrls[0];

                return db.collection(model.endpoint).doc(req.params.id).set({
                    imageUrl: url
                }, { merge: true })
            })
            .then(() => {
                return resolve(url);
            })
            .catch((err) => {
                return reject(err.message);
            })
        });

        stream.end(req.file.buffer);
    });
}

router.get('/diseases/search', (req, res) => {
    const index = client.initIndex(model.endpoint);
    const query = req.query.term;

    console.log("d");

    if(!query){
        return res.status(400).send("Please provide '?term=searchterm' in url");
    }

    index
    .search({
        query
    })
    .then(responses => {
        console.log("response");
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
