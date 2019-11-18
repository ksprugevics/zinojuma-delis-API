const functions = require('firebase-functions');
const express = require("express");
const cors = require('cors');

// Iegūstam admin tiesības datubāzei
var admin = require("firebase-admin");
var serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-demo-f4cc9.firebaseio.com"
});

//express instances
const main = express();
const app = express();

app.use(cors());


// Definē base url visiem requestiem.
main.use("/api", app);

// Visi rquesti izsauks app instanci
exports.api = functions.https.onRequest(app);

// Testa hello_world page
app.get('*/hello', (req, res) =>{
    res.send("Hello world!");
});

// Piekļūstam firebase datubāzei izmantojot adminu.
const db = admin.firestore();



// Lai pievienotu jaunu aktualitāti
app.post('*/aktualitates', (request, response) =>
{
    const postRef = db.collection('aktualitates');

    // Request body sastāvēs no šādām vērtībām
    const{nosaukums, apraksts, autors} = request.body;

    // Dati, kas tiks saglabāti pie katras aktualitātes
    const data =
    {
        datums: admin.firestore.FieldValue.serverTimestamp(),
        nosaukums,
        apraksts,
        autors
    } 

    // Pievienojam datubāzei post requesta body
    postRef.add(data)
    .then(postRef =>
    {
        return postRef.get();
    })
    .then(postDoc =>
    {
        const data = postDoc.data();
        const {nosaukums, apraksts, autors} = data;

        response.status(201).json({
            id: postDoc. id,
            nosaukums,
            apraksts,
            autors
        })
    })
});

app.get('*/aktualitates', (request, response) =>{
    const postRef = db.collection('aktualitates');

    // Saturēs visas aktualitātes
    const aktualitates = [];

    // Atgūstam visas aktualitātes
    postRef.get()
    .then((querySnapshot) =>{
        // Iterējam cauri visām aktualitātēm
        querySnapshot.forEach(function(doc) {
            // Tukšajā masīvā ievietojam iegūtu informāciju
            aktualitates.push({
                id: doc.id,
                datat: doc.data()
            });
        });
        // Iegūto informāciju atgriežam kā response
        response.send({aktualitates});
    })
    .catch((error) => {
        response.status(500).json({error: "Aktualitātes not found"});
    });
});

