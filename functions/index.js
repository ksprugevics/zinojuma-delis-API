const functions = require('firebase-functions');
const express = require("express");

// Iegūstam admin tiesības datubāzei
var admin = require("firebase-admin");
var serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-demo-f4cc9.firebaseio.com"
});
