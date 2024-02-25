'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const CLOTHING_DOCUMENT_NAME = 'Clothing'
const CLOTHING_COLLECTION_NAME = 'Clothes';

const ELECTRONIC_DOCUMENT_NAME = 'Electronic'
const ELECTRONIC_COLLECTION_NAME = 'Electronics';

const FURNITURE_DOCUMENT_NAME = 'Furniture';
const FURNITURE_COLLECTION_NAME = 'Furnitures';


const productSchema = new Schema({
    productName: {
        type: String,
        require: true,
    },
    productThumb: {
        type: String,
        require: true,   
    },
    productDescription: String,
    productPrice: {
        type: Number,
        require: true,
    },
    productQuantity: {
        type: Number,
        require: true,
    },
    productType: {
        type: Number,
        require: true,
        enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    productShop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    },
    productAttributes: {
        type: Schema.Types.Mixed,
        required: true,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// define product type = clothing
const clothingSchema = new Schema({
    productShop: {
        type: Schema.Types.ObjectId,
    },
    brand: {
        type: String,
        require: true,
    },
    size: String,
    material: String,
}, {
    timestamps: true,
    collection: CLOTHING_COLLECTION_NAME
})

// define product type = electronics
const electronicSchema = new Schema({
    productShop: {
        type: Schema.Types.ObjectId,
    },
    manufacture: {
        type: String,
        require: true,
    },
    model: String,
    color: String,
}, {
    timestamps: true,
    collection: ELECTRONIC_COLLECTION_NAME
})

// define product type = electronics
const furnitureSchema = new Schema({
    productShop: {
        type: Schema.Types.ObjectId,
    },
    brand: {
        type: String,
        require: true,
    },
    size: String,
    material: String,
}, {
    timestamps: true,
    collection: FURNITURE_COLLECTION_NAME
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model(ELECTRONIC_DOCUMENT_NAME, electronicSchema),
    clothing: model(CLOTHING_DOCUMENT_NAME, clothingSchema),
    furniture: model(FURNITURE_COLLECTION_NAME, furnitureSchema),
};
