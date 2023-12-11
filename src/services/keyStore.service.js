'use strict'

const keyStoreModel = require('../models/keyStore.model');

class KeyStoreService {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const token = await keyStoreModel.create({
                user: userId,
                publicKey,
                privateKey,
            })

            return token ? token : null;
        } catch (error) {
            return error;
        }
    }
}

module.exports = KeyStoreService;