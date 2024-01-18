'use strict'

const bcrypt = require('bcrypt');
const crypto = require('node:crypto');

const shopModel = require('../models/shop.model');

const KeyStoreService = require('./keyStore.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');

// Service
const { findByEmail } = require('./shop.service');
const { error } = require('node:console');

const ROLE_SHOP = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

function generatePublicAndPrivateKey() {
    // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    //     modulusLength: 4096,
    //     publicKeyEncoding: {
    //         type: 'pkcs1', // public key cryptoGraphy Standards 1 | pkcs8
    //         format: 'pem',
    //     },
    //     privateKeyEncoding: {
    //         type: 'pkcs1', // public key cryptoGraphy Standards 1
    //         format: 'pem',
    //     }
    // })

    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    return {
        privateKey,
        publicKey,
    }
}

async function generateToken({ payload, publicKey, privateKey }) {
    const tokens = await createTokenPair({ payload, publicKey, privateKey })

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
    static signOut = async ({ keyStore}) => {
        const delKey = await KeyStoreService.removeKeyById(keyStore._id);
        return delKey;
    }

    static signIn = async ({ email, password, refreshToken = null }) => {
        // 1 - Check email in dbs
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Shop not registered!');
        }

        // 2 - Matching password
        const matchPassword = bcrypt.compare(password, foundShop.password);
        if(!matchPassword) {
            throw new AuthFailureError('Authentication error!');
        }

        // 3 - Create Private & public Key
        const { privateKey, publicKey } = generatePublicAndPrivateKey();

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
        const holderShop = await shopModel
            .findOne({ email })
            .lean();

        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered!');
        }

        // 2 - Create shop
        const passwordHash = await bcrypt.hash(password, 10);
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: ROLE_SHOP.SHOP,
        })

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