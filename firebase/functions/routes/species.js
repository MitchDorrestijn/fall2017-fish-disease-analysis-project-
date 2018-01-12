const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const gcs = require('@google-cloud/storage');
const algoliasearch = require('algoliasearch');
const Joi = require("joi");
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

const multer  = require('multer');
const upload = multer();

/* Shortcuts */
const db = admin.firestore();
const bucket = admin.storage().bucket();

/* Model Definition */
const model = {
    name: "species",
    endpoint: "species",
    keys: ["name", "info", "additional", "picture"],
    schema: {
        create: Joi.object().keys({
            name: Joi.string().min(3).required(),
            info: Joi.string().min(3).required(),
            additional: Joi.string().min(3).required(),
						picture: Joi.string().optional()
        }),

        update: Joi.object().keys({
            name: Joi.string().min(3),
            info: Joi.string().min(3),
            additional: Joi.string().min(3)
        })
    }
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

router.post('/' + model.endpoint, isAuthenticated, validate(model.name, model.schema.create), (req, res) => {
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

router.post('/' + model.endpoint + '/:id/upload', isAdmin, upload.single('image'), (req, res) => {
    if(req.file){
        return uploadViaMulter(req.file, req.params.id).then(() => {
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
            let gcsname = 'species/' + req.params.id + '/' + Date.now() + filename;
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
            resolve('success');
        })

        // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
        // a callback when it's finished.
        busboy.end(req.rawBody);
    });
}

const uploadViaMulter = (image, id) => {
    return new Promise((resolve, reject) => {
        let gcsname = 'species/' + req.params.id + '/' + Date.now() + image.originalname;
        const file = bucket.file(gcsname);

        let url = "";

        const stream = file.createWriteStream({
            metadata: {
                contentType: image.mimetype
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

        stream.end(image.buffer);
    });
}

router.put('/' + model.endpoint + '/:id', isAuthenticated, validate(model.name, model.schema.update), (req, res) => {
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

router.get('/' + model.endpoint + '/search', (req, res) => {
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
