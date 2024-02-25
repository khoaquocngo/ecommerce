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
 
}

module.exports = new ProductController();