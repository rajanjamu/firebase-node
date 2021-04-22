const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const firebase = require('firebase');
const dotenv = require('dotenv');
const { time } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

dotenv.config();

const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
const server_host = process.env.YOUR_HOST || '0.0.0.0';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
//app.use(express.json());
app.set('view engine', 'ejs');

firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET,
});

// Get a reference to the database service
let database = firebase.database();
let valveStatus, threshold, mode, wifiSS, timestamp;

database.ref('/dataStream').on('child_added', (snapshot, prevChildKey) => {
  console.log(snapshot.val());
  wifiSS = snapshot.val().wifiSS;
  timestamp = parseInt(snapshot.val().timestamp);
});

io.on('connection', (socket) => {
  console.log('New socket connection!');

  database.ref('/stateParams').on('value', (snapshot) => {
    valveStatus = snapshot.val().valveStatus;
    threshold = snapshot.val().threshold;
    mode = snapshot.val().mode;
    socket.emit('valveStatusUpdate', valveStatus);
  });
});

app.get('/', (req, res) => {
  let wifiStrength;
  console.log(wifiSS);
  if (wifiSS >= -50) {
    wifiStrength = 'Excellent';
    console.log('Excellent');
  } else if (wifiSS >= -60) {
    wifiStrength = 'Very Good';
    console.log('Very Good');
  } else if (wifiSS >= -70) {
    wifiStrength = 'Good';
    console.log('Good');
  } else {
    wifiStrength = 'Poor';
    console.log('Poor');
  }

  res.render('index', {
    valveStatus,
    threshold,
    mode,
    wifiStatus: wifiStrength,
    timestamp,
  });
});

app.post('/updateState', (req, res) => {
  const data = req.body;
  let path, value, mode;

  if (data.valveStatus != undefined) {
    valveStatus = data.valveStatus == 'true';
    path = 'valveStatus';
    value = valveStatus;
  }

  if (data.mode != undefined) {
    mode = data.mode == 'true';
    path = 'mode';
    value = mode;
  }

  if (data.threshold != undefined) {
    threshold = parseInt(data.threshold);
    path = 'threshold';
    value = threshold;
  }

  database.ref(`/stateParams/${path}`).set(value, (err) => {
    if (err) {
      console.log('Failed with error: ' + err);
      return;
    }
  });
  res.redirect('/');
});

// Server
server.listen(server_port, server_host, () => {
  console.log(`Listening on port ${server_port}...`);
});
