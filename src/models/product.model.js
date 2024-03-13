'use strict'

const { Schema, model } = require('mongoose');
const slugify = require('slugify');

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
    }, // High KOPU
    productThumb: {
        type: String,
        require: true,   
    },
    productDescription: String,
    productSlug: String, // kopu-cao-cap
    productPrice: {
        type: Number,
        require: true,
    }, // hight-kopu
    productQuantity: {
        type: Number,
        require: true,
    },
    productType: {
        type: String,
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
    },

    // more ...
    productRatingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Ratibg mus be above 2.0'],
        set: (vale) => Math.round(vale * 10) / 10
    },
    productVariations: {
        type: Array,
        default: [],
    },
    isDraft: {
        type: Boolean,
        default: true,
        indexes: true,
        select: false,        
    },
    isPublished: {
        type: Boolean,
        default: false,
        indexes: true,
        select: false,        
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

// create Index
productSchema.index({productName: 'text',  productDescription: 'text'});


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

// Document middleware: run before .save() and create()
productSchema.pre('save', function (next) {
    this.productSlug = slugify(this.productName, { lower: true });
    next();
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
    furniture: model(FURNITURE_DOCUMENT_NAME, furnitureSchema),
};
