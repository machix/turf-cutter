const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
// const jwt = require('jsonwebtoken');

const mongo = require('./mongo-connection');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(favicon(`${__dirname}/public/favicon.ico`));
app.use(logger('dev'));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

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

mongo.connectToServer((err) => {
  if (err) throw err;

  /* start server only if MongoDB is connected */
  http.createServer(app).listen(port, (err) => {
    /* eslint-disable global-require */
    app.use('/api', require('./routes/api/index'));
    app.use('/api/turf', require('./routes/api/turf'));
    app.use('/api/addresses', require('./routes/api/addresses'));
    app.use('/api/geocode', require('./routes/api/geocode'));

    app.get('/ping', (req, res) => {
      res.send({ message: 'Server online!' });
    });
  });
});
