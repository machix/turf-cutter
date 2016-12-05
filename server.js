const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const jwt = require('jsonwebtoken');
const hat = require('hat'); // eslint-disable-line
const MongoClient = require('mongodb').MongoClient;

const getToken = require('./routes/get-token');
const apiIndex = require('./routes/api/index');
const turf = require('./routes/api/turf');
const geocode = require('./routes/api/geocode');

dotenv.load();

const app = express();

const port = process.env.PORT || 3001;
const mongoUrl = 'mongodb://localhost:27017/votivate-dev';

const auth0Keys = {
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
};

/* uncomment this to create a new key
const generatedKey = hat(256, 16);
console.log(secret); */

/* eslint-disable consistent-return */
/* eslint-disable no-console */

app.use(cors());
app.use(favicon(`${__dirname}/public/favicon.ico`));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/ping', (req, res) => {
  res.send({ message: 'Server online!' });
});
app.use('/get-token', getToken);
// app.use('/api', (req, res, next) => {
//   const token = req.body.token || req.query.token || req.headers['x-access-token'];
//   if (token) {
//     jwt.verify(token, basicKey, (err, decoded) => {
//       if (err) return res.json({ error: 'Failed to authenticate token...' });
//       req.decoded = decoded; // eslint-disable-line no-param-reassign
//       return next();
//     });
//   } else {
//     return res.status(403).send({
//       error: 'No token provided...'
//     });
//   }
// });
app.use('/api', apiIndex);
app.use('/api/turf', turf);
app.use('/api/geocode', geocode);


// Express only serves static client assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

MongoClient.connect(mongoUrl, (err) => {
  if (err) throw err;
  // only start server if MongoDB connection made
  http.createServer(app).listen(port, (err) => {
    console.log(`Find the server at: http://localhost:${port}/`);
  });
});

module.exports = app;
