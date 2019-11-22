const functions = require('firebase-functions');

// Admin un API settingi.
const{
    db,
    admin,
    app
} = require('./admin.js');

// Aktualitātes metodes.
const {
    AktualitatesGet,
    AktualitatesGetByID,
    AktualitatesPost,
    AktualitatesDelete,
    AktualitatesUpdate
 } = require('./api-functions/aktualitates.js');

 // Paziņojumi metodes.
 const {
    PazinojumiGet,
    PazinojumiGetByID,
    PazinojumiPost,
    PazinojumiDelete,
    PazinojumiUpdate
 } = require('./api-functions/pazinojumi.js');

 // Lekcijas metodes.
 const {
    LekcijasGet,
    LekcijasGetByID,
    LekcijasPost,
    LekcijasDelete,
    LekcijasUpdate
 } = require('./api-functions/lekcijas.js');

// Visi rquesti izsauks app instanci
exports.api = functions.https.onRequest(app);

//Lai palaistu serveri:
//firebase serve --only functions,hosting
