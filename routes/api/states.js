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
  db.collection('venues').aggregate([
    { $group: { _id: '$address.state', count: { $sum: 1 } } }
  ]).toArray((err, result) => {
    if (err) return console.log(err);
    res.json(result);
  });
});

module.exports = router;
