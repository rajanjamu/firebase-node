const express = require('express');
const firebase = require('firebase');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
const server_host = process.env.YOUR_HOST || '0.0.0.0';
app.set('view engine', 'ejs');

firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET,
});

// Get a reference to the database service
let database = firebase.database();

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/ledOn', (req, res) => {
  database.ref('/').set({ ledStatus: 1 }, function (error) {
    if (error) {
      console.log('Failed with error: ' + error);
    } else {
      console.log('success');
    }
  });
  res.redirect('/');
});

app.post('/ledOff', (req, res) => {
  database.ref('/').set({ ledStatus: 0 }, function (error) {
    if (error) {
      console.log('Failed with error: ' + error);
    } else {
      console.log('success');
    }
  });
  res.redirect('/');
});

// Server
app.listen(server_port, server_host, () => {
  console.log(`Listening on port ${server_port}...`);
});
