'use strict'

const express = require('express');
const router = express.Router();

const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

router.get('/:id', asyncHandler(productController.findProduct));
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));
router.get('', asyncHandler(productController.findAllProducts))

// Authentication
router.use(authentication);
router.post('', asyncHandler(productController.createProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct));
router.post('/publish/:id', asyncHandler(productController.publishProduct));
router.post('/unPublish/:id', asyncHandler(productController.unPublishProduct));

// QUERY //
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))


module.exports = router;