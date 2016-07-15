'use strict';

const firebase = require('firebase');
const config   = require('../config/enviroment');

const firebaseApp = firebase.initializeApp({
  apiKey: config.firebase.api_key,
  authDomain: config.firebase.auth_domain,
  databaseURL: config.firebase.db_url,
  serviceAccount: config.firebase.serviceAccount
});

module.exports = firebaseApp;
