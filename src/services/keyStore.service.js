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
}

module.exports = KeyStoreService;