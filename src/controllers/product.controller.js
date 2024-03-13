'use strict'

const { SuccessResponse, CREATED } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/v2.product.service");

class ProductController {
    createProduct = async (req, res, next) => {
        // const { productType, ...payload} = req.body;
        // const newProduct = await ProductService.createProduct({ 
        //     type: productType, 
        //     payload: {
        //         ...payload,
        //         productShop: req.user.userId,
        //     } 
        // });
        // new SuccessResponse({
        //     message: 'Create new product success!',
        //     metadata: newProduct,
        // }).send(res);

        const { productType, ...payload} = req.body;
        const newProduct = await ProductServiceV2.createProduct({ 
            type: productType, 
            payload: {
                ...payload,
                productShop: req.user.userId,
            } 
        });
        new SuccessResponse({
            message: 'Create new product success!',
            metadata: newProduct,
        }).send(res);

    }

    updateProduct = async (req, res, next) => {
        const product = await ProductServiceV2.updateProduct({
            type: req.body.productType,
            productId: req.params.productId,
            payload: {
                ...req.body,
                productShop: req.user.userId,
            }
        })

        new SuccessResponse({
            message: 'Update Product Success',
            metadata: product,
        }).send(res);
    }

    // PUT
    publishProduct = async (req, res, next) => {
        const published = await ProductServiceV2.publishProductByShop({
            productId: req.params.id,
            productShop: req.user.userId,
        }) 

        new SuccessResponse({
            message: 'Published Product By Shop',
            metadata: published,
        }).send(res);
    }

    unPublishProduct = async (req, res, next) => {
        const published = await ProductServiceV2.unPublishProductByShop({
            productId: req.params.id,
            productShop: req.user.userId,
        }) 

        new SuccessResponse({
            message: 'unPublished Product By Shop',
            metadata: published,
        }).send(res);
    }
    // END PUT

    // QUERY
    /**
     * @description Get All Draft For Shop
     * @param {Number} limit
     * @param {Number} skip 
     * @returns { JSON }
     */
    getAllDraftsForShop = async (req, res, next) => {
        const products = await ProductServiceV2.findAllDraftsForShop({ productShop: req.user.userId })

        new SuccessResponse({
            message: 'Get list draft success!',
            metadata:  products
        }).send(res);
    }


    getAllPublishForShop = async (req, res, next) => {
        const products = await ProductServiceV2.findAllPublishForShop({ productShop: req.user.userId })

        new SuccessResponse({
            message: 'Get list publish success!',
            metadata:  products
        }).send(res);
    }

    getListSearchProduct = async (req, res, next) => {
        const products = await ProductServiceV2.getListSearchProducts(req.params);

        new SuccessResponse({
            message: 'Get list search products success!',
            metadata:  products
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
        const products = await ProductServiceV2.findAllProducts(req.params);

        new SuccessResponse({
            message: 'Get list products success!',
            metadata:  products
        }).send(res);
    }

    findProduct = async (req, res, next) => {
        const products = await ProductServiceV2.findProduct(req.params);

        new SuccessResponse({
            message: 'Get detail product success!',
            metadata:  products
        }).send(res);
    }

    // END QUERY //
 
}

module.exports = new ProductController();