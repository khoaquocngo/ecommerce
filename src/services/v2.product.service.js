'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response')
const { 
    findAllDraftsForShop, 
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
} = require('../models/repositories/product.repo');
const { removeNillObject } = require('../utils');

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

    // update product
    async updateProduct(productId, payload) {   
        const updateProduct =  await updateProductById({ productId, payload, model: product });
        return updateProduct;
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

    async updateProduct(productId) {
        // 1. Remove attributes has null undefined
        const payload = removeNillObject(this);

        // 2. Check update where?
        if (payload.productAttributes) {
            // update child
            await updateProductById({ productId, payload, model: clothing });
        }

        const updateProduct = await super.updateProduct(productId, payload);
        return updateProduct;
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
        const newFurniture = await furniture.create({
            ...this.productAttributes,
            productShop: this.productShop,
        });
        if(!newFurniture) throw new BadRequestError('Create new Furniture error');

        const newProduct = await super.createProduct(newFurniture._id);
        if(!newProduct) throw new BadRequestError('Create new Product error');

        return newProduct;
    }
}

// Register product type
const PRODUCT_REGISTRIES = {
    'Clothing': Clothing,
    'Electronic': Electronic,
    'Furniture': Furniture,
}

class ProductFactory {
    static productRegistry = {}; // key-class

    static registerProductType() {
        Object.keys(PRODUCT_REGISTRIES).forEach(productRegistry => {
            ProductFactory.productRegistry[productRegistry] = PRODUCT_REGISTRIES[productRegistry];
        });
    }    
    
    static async createProduct({ type, payload }) {
        const productClass = ProductFactory.productRegistry[type];
        
        if(!type) throw new BadRequestError(`Invalid Product Type ${type}`);
        return new productClass(payload).createProduct();
    }

    static async updateProduct({ type, productId, payload }) {
        const productClass = ProductFactory.productRegistry[type];
        
        if(!type) throw new BadRequestError(`Invalid Product Type ${type}`);
        return new productClass(payload).updateProduct(productId);
    }

    static async publishProductByShop({ productShop, productId }) {
        const publishProduct = await publishProductByShop({ productShop, productId });
        return !!publishProduct;
    }

    static async unPublishProductByShop({ productShop, productId }) {
        const unPublishProduct = await unPublishProductByShop({ productShop, productId });
        return !!unPublishProduct;
    }


    static async findAllDraftsForShop({ productShop, limit = 50, skip = 0}) {
        const query = { productShop, isDraft: true };
        const products = await findAllDraftsForShop({ query, limit, skip });
        return products;
    }

    static async findAllPublishForShop({ productShop, limit = 50, skip = 0}) {
        const query = { productShop, isPublished: true };
        const products = await findAllPublishForShop({ query, limit, skip });
        return products;
    }

    static async getListSearchProducts({ keySearch }) {
        const products = await searchProductByUser({ keySearch });
        return products;
    }

    static async findAllProducts({ 
        limit = 50, 
        sort = 'ctime', 
        page = 1, 
        filter = {
            isPublished: true
        },
        select = ['productName', 'productThumb', 'productPrice'],
    }) {
        const products = await findAllProducts({  limit, sort, page, filter, select });
        return products;
    }
 
    static async findProduct({ id, unSelect = ['-__v', '-productVariations'] }) {
        const products = await findProduct({ id, unSelect, });
        return products;
    }
}

ProductFactory.registerProductType();

module.exports = ProductFactory;
