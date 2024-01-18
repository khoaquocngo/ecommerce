'use strict'

const express = require('express');
const router = express.Router();

const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// Not Authentication
router.post('/shop/signUp', asyncHandler(accessController.signUp));
router.post('/shop/signIn', asyncHandler(accessController.signIn));

// Authentication
router.use(authentication);
router.post('/shop/signOut', asyncHandler(accessController.signOut));

module.exports = router;