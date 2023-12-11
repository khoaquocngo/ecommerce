'use strict'

const express = require('express');
const router = express.Router();

const Access = require('./access');
const { apiKey, permission } = require('../auth/checkAuth');

// Check apiKey
router.use(apiKey);

// Check permission
router.use(permission('0000'));

router.use('/v1/api', Access)


module.exports = router;