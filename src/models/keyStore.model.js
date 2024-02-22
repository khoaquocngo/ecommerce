
'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'KeyStore';
const COLLECTION_NAME = 'KeyStores';

const keyStoreSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        require: true,
    },
    privateKey: {
        type: String,
    },
    refreshTokensUsed: {
        type: Array,
        default: [],
    },
    refreshTokens: {
        type: Array,
        default: [],
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, keyStoreSchema);
