const express = require('express');
const firebase = require('firebase');
const app = express();

const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');

firebase.initializeApp({
  apiKey: 'Om5VROO5S5B3kpGh1ywihjrv4V404nl7AdL2FgLv',
  authDomain: 'esp-32-9e307.firebaseapp.com',
  databaseURL: 'https://esp-32-9e307-default-rtdb.firebaseio.com',
  storageBucket: 'bucket.appspot.com',
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

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
