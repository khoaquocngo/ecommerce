'use strict'

const bcrypt = require('bcrypt');

const KeyStoreService = require('./keyStore.service');
const { createTokenPair, generatePublicAndPrivateKey } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');

// Service
const ShopService = require('./shop.service');

const ROLE_SHOP = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

async function generateToken({ payload, publicKey, privateKey }) {
    const tokens = await createTokenPair({ payload, publicKey, privateKey });

    KeyStoreService.createKeyToken({ 
        userId: payload.userId, 
        refreshToken: tokens.refreshToken, 
        publicKey, 
        privateKey 
    }).catch(error => {
        console.log('error ~ generateToken', error.message);
    })

    return tokens;
}


class AccessService {
    static handleRefreshToken = async ({ user, keyStore, refreshToken }) => {
        const { userId, email } = user;

        // Token has been used
        const foundToken = (keyStore?.refreshTokensUsed || []).includes(refreshToken);
        if(foundToken) {
            // Remove all token
            await KeyStoreService.deleteKeyByUserId(userId);
            throw new BadRequestError('Something wrong happened!!');
        }

        const validRefreshToken = (keyStore?.refreshTokens || []).includes(refreshToken)
        if(!validRefreshToken) {
            throw new BadRequestError('Something wrong happened!!');
        }

        const foundShop = await ShopService.findByEmail({ email });
        if(!foundShop) {
            throw new AuthFailureError('Shop not registered!')
        }

        const tokens = await generateToken({ 
            payload: getInfoData({ fields: ['userId', 'email'], obj: user }), 
            privateKey: keyStore.privateKey, 
            publicKey: keyStore.publicKey 
        })

        KeyStoreService.updateRefreshTokenUsed(userId, refreshToken)
            .catch(error => {
            console.log('error ~ generateToken', error.message);
        });

        return {
            shop: getInfoData({ fields: ['_id','name', 'email'], obj: foundShop }),
            tokens,
        }

    }

    static signOut = async ({ userId, refreshToken }) => {
        await KeyStoreService.updateRefreshTokenUsed(userId, refreshToken);
    }

    static signIn = async ({ email, password, refreshToken = null }) => {
        // 1 - Check email in dbs
        const foundShop = await ShopService.findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Shop not registered!');
        }

        // 2 - Matching password
        const matchPassword = bcrypt.compare(password, foundShop.password);
        if(!matchPassword) {
            throw new AuthFailureError('Authentication error!');
        }

        // 3 - Create Private & public Key
        const keyStore = await KeyStoreService.findByUserId(foundShop._id);
        let { privateKey, publicKey } = keyStore || {};

        if(!keyStore) {
            const generateKeys = generatePublicAndPrivateKey();
            privateKey = generateKeys.privateKey;
            publicKey = generateKeys.publicKey;
        }

        // 4 - Generate Tokens
        const payload = { userId: foundShop._id, email };
        const tokens = await generateToken({ payload, privateKey, publicKey });

        return {
            shop: getInfoData({ fields: ['_id','name', 'email'], obj: foundShop }),
            tokens,
        }
    };

    static signUp = async ({ name, email, password }) => {
        // 1 - Check email exists??
        const holderShop = await ShopService.findByEmail({ email });

        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered!');
        }

        // 2 - Create shop
        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await ShopService.createShop({
            name, email, password: passwordHash, roles: ROLE_SHOP.SHOP,
        });

        if (!newShop) {
            throw new BadRequestError('Error: Can not create shop!')         
        }

        // 3 - Create Private & public Key
        const { privateKey, publicKey } = generatePublicAndPrivateKey();

        // 4 - Generate Tokens
        const payload = { userId: newShop._id, email };
        const tokens = await generateToken({ payload, publicKey, privateKey });

        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                obj: newShop,
            }),
            tokens,
        }
    };
     
}

module.exports = AccessService;