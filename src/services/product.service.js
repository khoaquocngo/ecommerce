'use strict'

const { product, clothing, electronic } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response')

// Define factory class to create product
class ProductFactory {
    /*
        type: 'Clothing'
        payload,
    */
    static async createProduct({ type, payload }) {
        switch (type) {
            case 'Electronic':
                return new Electronic(payload).createProduct();
            case 'Clothing':
                return new Clothing(payload).createProduct();
            default:
                throw new BadRequestError(`Invalid Product Type ${type}`);
        }

    }
}

// Define base product class
class Product {
    constructor({
        productName,
        productThumb,
        productDescription,
        productPrice,
        productQuantity,
        productType,
        productShop,
        productAttributes,
    }) {
        this.productName = productName
        this.productThumb = productThumb
        this.productDescription = productDescription
        this.productPrice = productPrice
        this.productQuantity = productQuantity
        this.productType = productType
        this.productShop = productShop
        this.productAttributes = productAttributes
    }

    // create new product
    async createProduct(productId) {
        const newProduct = await product.create({
            ...this,
            _id: productId,
        });
        return newProduct;
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.productAttributes,
            productShop: this.productShop,
        });
        if(!newClothing) throw new BadRequestError('Create new Clothing error');

        const newProduct = await super.createProduct(newClothing._id);
        if(!newProduct) throw new BadRequestError('Create new Product error');

        return newProduct;
    }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.productAttributes,
            productShop: this.productShop,
        });
        if(!newElectronic) throw new BadRequestError('Create new Electronic error');

        const newProduct = await super.createProduct(newElectronic._id);
        if(!newProduct) throw new BadRequestError('Create new Product error');

        return newProduct;
    }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.productAttributes,
            productShop: this.productShop,
        });
        if(!newElectronic) throw new BadRequestError('Create new Electronic error');

        const newProduct = await super.createProduct(newElectronic._id);
        if(!newProduct) throw new BadRequestError('Create new Product error');

        return newProduct;
    }
}

module.exports = ProductFactory;
