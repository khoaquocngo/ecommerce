'use strict'

const express = require('express');
const router = express.Router();

const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');

// signUp
router.post('/shop/signUp', asyncHandler(accessController.signUp));
router.post('/shop/signIn', asyncHandler(accessController.signIn));

module.exports = router;