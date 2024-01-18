'use strict'

const keyStoreModel = require('../models/keyStore.model');

class KeyStoreService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        const filter = { user: userId };
        const update = { 
            user: userId, 
            publicKey, 
            privateKey,
            refreshToken,
        };
        const option = { upsert: true, new: true }

        const token = await keyStoreModel.findOneAndUpdate(filter, update, option);

        return token ? token.publicKey : null;
    }

    static findByUserId = async (user) => {
        const shop = await keyStoreModel
            .findOne({ user })
            .lean()
        
        return shop;
    }

    static removeKeyById = async (id) => {
        const removeKey = await keyStoreModel.deleteOne({ _id: id });
        
        return removeKey;
    }
}

module.exports = KeyStoreService;