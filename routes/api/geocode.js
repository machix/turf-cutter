const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const NodeGeocoder = require('node-geocoder');

const router = express.Router();

const mongoUrl = 'mongodb://localhost:27017/votivate-dev';
let db;

const geocoder = NodeGeocoder({
  provider: 'google',
  httpAdapter: 'https',
  formatter: null
});

/* eslint-disable no-console */

MongoClient.connect(mongoUrl, (err, database) => {
  if (err) return console.log(err);
  db = database;
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', (req, res) => {
  // geocoder.geocode('92008', (err, geo) => {
  //   if (err && String(err[Object.keys(err)[0]]).includes('OVER_QUERY_LIMIT')) {
  //     console.log('Over geocoding query limit, stopping.');
  //     return res.json({ error: 'Over geocoding query limit, try back later.' });
  //   } else if (err) throw err;
  //   return res.json(geo);
  // });

  geocoder.reverse({ lat: 33.1412124, lon: -117.3205123 }, (err, geo) => {
    if (err && String(err[Object.keys(err)[0]]).includes('OVER_QUERY_LIMIT')) {
      console.log('Over geocoding query limit, stopping.');
      return res.json({ error: 'Over geocoding query limit, try back later.' });
    } else if (err) throw err;
    return res.json(geo);
  });
});

router.post('/', (req, res) => {
  if (req.body.lat && req.body.lng) {
    geocoder.reverse({ lat: req.body.lat, lon: req.body.lng }, (err, geo) => {
      if (err && String(err[Object.keys(err)[0]]).includes('OVER_QUERY_LIMIT')) {
        console.log('Over geocoding query limit, stopping.');
        return res.json({ error: 'Over geocoding query limit, try back later.' });
      } else if (err) throw err;
      // TODO: run reverse geocoded address through geocoder
      geocoder.geocode(geo[0].formattedAddress, (err, geo2) => {
        if (err && String(err[Object.keys(err)[0]]).includes('OVER_QUERY_LIMIT')) {
          console.log('Over geocoding query limit, stopping.');
          return res.json({ error: 'Over geocoding query limit, try back later.' });
        } else if (err) throw err;
        db.collection('addresses').findOne({ formattedAddress: geo2[0].formattedAddress }, (err, cursor) => {
          if (err) throw err;
          if (!cursor) {
            const newAddress = geo2[0];
            newAddress.created_at = new Date();
            newAddress.updated_at = new Date();
            db.collection('addresses').save(newAddress, (err) => {
              if (err) throw err;
              db.collection('addresses')
              .findOne({ formattedAddress: geo2[0].formattedAddress }, (err, newCursor) => {
                if (err) throw err;
                return res.json(newCursor);
              });
            });
          } else {
            return res.json({
              error: `${geo[0].formattedAddress} already exists, not saved.`
            });
          }
        });
      });
    });
  }
});

module.exports = router;
