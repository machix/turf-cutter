const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const router = express.Router();

dotenv.load();

const basicKey = process.env.BASIC_API_KEY;

/* eslint-disable no-console */

router.get('/', (req, res) => {
  const token = jwt.sign({ auth: 'basic' }, basicKey);

  res.json({
    success: true,
    message: 'Here\'s your token!',
    token
  });
});

module.exports = router;
