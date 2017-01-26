const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

const mongo = require('../../mongo-connection');

const db = mongo.getDb();
const router = express.Router();
const addresses = db.collection('addresses'); // eslint-disable-line

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
