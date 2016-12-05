const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const router = express.Router();
const mongoUrl = 'mongodb://localhost:27017/showspark';
let db;

/* eslint-disable no-console */

MongoClient.connect(mongoUrl, (err, database) => {
  if (err) return console.log(err);
  db = database;
});

router.get('/', (req, res) => {
  if (req.query.zip) {
    const query = {
      zip: req.query.zip
    };
    db.collection('zipcodes').find(query).nextObject((err, result) => {
      if (result) {
        return res.json(result);
      }
      return res.json({ error: 'Zero results. Try refining your query.' });
    });
  } else if (req.query.state) {
    const query = {
      state: req.query.state
    };
    db.collection('zipcodes').find(query).toArray((err, result) => {
      if (result.length > 0) {
        return res.json(result);
      }
      return res.json({ error: 'Zero results. Try refining your query.' });
    });
  } else if (req.query.all) {
    db.collection('zipcodes').find({}).toArray((err, result) => {
      return res.json(result);
    });
  } else {
    return res.json({ error: 'Missing required URL query paramter.' });
  }
});

module.exports = router;
