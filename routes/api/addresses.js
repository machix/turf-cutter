const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dotenv = require('dotenv');

const router = express.Router();

dotenv.load();

const dbUrl = process.env.MLAB_DB_URL;
const dbUser = process.env.MLAB_DB_USER;
const dbPass = process.env.MLAB_DB_PASS;

let db;
let addresses;

/* eslint-disable no-console */

MongoClient.connect(`mongodb://${dbUser}:${dbPass}@${dbUrl}`, (err, database) => {
  if (err) return console.log(err);
  db = database;
  addresses = db.collection('addresses');
});

router.use(bodyParser.json({ limit: '50mb' }));
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

router.get('/', (req, res) => {
  const query = req.query.zip || {};
  addresses.find(query).toArray((err, result) => {
    if (err) throw err;
    if (result) {
      return res.json(result);
    }
    return res.json({ error: 'Zero results. Try refining your query.' });
  });
});

router.post('/', (req, res) => {
  const addr = Object.keys(req.body).map(k => req.body[k]);
  addr.forEach((address) => {
    addresses.update({ _id: ObjectID(address._id) }, {
      $set: {
        turfId: address.turfId,
        iconColor: address.iconColor,
        updated_at: new Date()
      }
    }, (err) => {
      if (err) throw err;
    });
  });
  return res.json({ message: 'Addresses successfully saved!' });
});

module.exports = router;
