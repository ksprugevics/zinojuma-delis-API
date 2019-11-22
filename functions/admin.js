// Nodefinējam API šeit un izmantojam visur, kur nepieciešams.

const admin = require("firebase-admin");
const serviceAccount = require("./service_key.json");
const express = require("express");
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-demo-f4cc9.firebaseio.com"
});

// Piekļūstam firebase datubāzei, izmantojot adminu.
const db = admin.firestore();

// Express instances.
const main = express();
const app = express();

// Atļaujam CORS.
app.use(cors());

// Definē base url visiem requestiem.
main.use("/api", app);

module.exports = {
    db,
    admin,
    app
}
