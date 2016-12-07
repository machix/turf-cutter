const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const router = express.Router();
const mongoUrl = 'mongodb://localhost:27017/votivate-dev';
let db;

let turf;

/* eslint-disable no-console */

MongoClient.connect(mongoUrl, (err, database) => {
  if (err) return console.log(err);
  db = database;
  turf = db.collection('turf');
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', (req, res) => {
  const query = req.query.zip || {};
  turf.find(query).toArray((err, result) => {
    if (err) throw err;
    if (result) {
      return res.json(result);
    }
    return res.json({ error: 'Zero results. Try refining your query.' });
  });
});

router.post('/', (req, res) => {
  if (req.body && Object.keys(req.query).length !== 0) {
    turf.update({
      _id: ObjectID(req.query.id)
    }, {
      $set: { path: req.body.path, updated_at: new Date() }
    }, (err) => {
      if (err) throw err;
      turf.findOne({ _id: ObjectID(req.query.id) }, (err, record) => {
        if (err) throw err;
        return res.json(record);
      });
    });
  } else if (req.body && Object.keys(req.query).length === 0) {
    const newTurf = req.body;
    newTurf.created_at = new Date();
    newTurf.updated_at = new Date();

    turf.insertOne(newTurf, (err, record) => {
      if (err) throw err;
      return res.json(record.ops[0]);
    });
  } else { return res.json({ error: 'No body...' }); }
});

module.exports = router;
