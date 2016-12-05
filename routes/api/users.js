const express = require('express');

const router = express.Router();

/* eslint-disable no-console */

/* GET users. */
router.get('/', (req, res, next) => {
  res.send({ message: 'Loaded users! ' });
});

module.exports = router;
