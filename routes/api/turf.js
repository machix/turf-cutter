const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const router = express.Router();
const mongoUrl = 'mongodb://localhost:27017/votivate-dev';
let db;

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
  const query = req.query.zip || {};
  db.collection('turf').find(query).toArray((err, result) => {
    if (err) throw err;
    if (result) {
      return res.json(result);
    }
    return res.json({ error: 'Zero results. Try refining your query.' });
  });
});

router.post('/', (req, res) => {
  if (req.body) {
    const turf = req.body;
    turf.created_at = new Date();
    turf.updated_at = new Date();
    db.collection('turf').save(turf, { w: 1 }, (err, record) => {
      if (err) throw err;
      console.log(`Successfully saved ${record}`);
      return res.json({ message: 'Sucessfully saved turf!' });
    });
  } else { return res.json({ message: 'No body...' }); }
});

module.exports = router;
