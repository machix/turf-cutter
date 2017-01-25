const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
// const jwt = require('jsonwebtoken');

const apiIndex = require('./routes/api/index');
const turf = require('./routes/api/turf');
const addresses = require('./routes/api/addresses');
const geocode = require('./routes/api/geocode');

dotenv.load();

const app = express();
const port = process.env.PORT || 3001;

/* eslint-disable consistent-return */
/* eslint-disable no-console */

app.use(cors());
app.use(favicon(`${__dirname}/public/favicon.ico`));
app.use(logger('dev'));
app.use(cookieParser());

app.get('/ping', (req, res) => {
  res.send({ message: 'Server online!' });
});

/* token authentication disabled for now */

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
app.use('/api/addresses', addresses);
app.use('/api/geocode', geocode);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

http.createServer(app).listen(port, (err) => {
  console.log('The server is online!');
});

module.exports = app;
