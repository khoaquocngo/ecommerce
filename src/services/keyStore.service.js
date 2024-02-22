'use strict'

const keyStoreModel = require('../models/keyStore.model');

class KeyStoreService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        const filter = { user: userId };
        const update = { 
            $set: {
                user: userId, 
                publicKey, 
                privateKey,
            },
            $push: {
                refreshTokens: refreshToken,
            }
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

    static findByRefreshTokenUsed = async (refreshToken) => {
        const findRefreshToken = await keyStoreModel
            .findOne({ refreshTokensUsed: refreshToken })
            .lean()
        
        return findRefreshToken;
    }

    static deleteKeyByUserId = async (userId) => {
        const keyStore = await keyStoreModel.findOneAndDelete({ user: userId });
        return keyStore;
    }

    static updateRefreshTokenUsed = async (userId, refreshToken) => {
        await keyStoreModel.updateOne(
            { user: userId },
            {
                $addToSet: {
                    refreshTokensUsed: refreshToken,
                },
                $pull: {
                    refreshTokens: refreshToken,
                }
            }
        )
    }
}

module.exports = KeyStoreService;