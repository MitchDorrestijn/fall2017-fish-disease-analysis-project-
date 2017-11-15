const functions = require('firebase-functions');
const express = require('express')

/* Express */
const app = express()
app.get("/", (request, response) => {
  response.send("Hello from root!")
})

app.get("/home", (request, response) => {
  response.send("Hello from Express on Firebase!")
})

app.get("/other", (request, response) => {
  response.send("Hello from Express on other!")
})

exports.app = functions.https.onRequest(app)