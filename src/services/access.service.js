'use strict'

const bcrypt = require('bcrypt');
const crypto = require('node:crypto');

const shopModel = require('../models/shop.model');

const KeyStoreService = require('./keyStore.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');

const ROLE_SHOP = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        try {
            // step 1: check email exists??
            const holderShop = await shopModel
                .findOne({ email })
                .lean();

            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already registered!'
                }
            }
            
            // step 2: create shop
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: ROLE_SHOP.SHOP,
            })

            if (!newShop) {
                return {
                    code: 'xxx',
                    message: 'Can not create shop!',
                }
            }
            
            // step 3: create token
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


            const keyStores = await KeyStoreService.createKeyToken({
                userId: newShop._id,
                publicKey,
            })

            if (!keyStores) {
                return {
                    code: 'xxx',
                    message: 'Not generate key stores!',
                }
            }

            // const publicKeyObj = crypto.createPublicKey(publicKeyString);
            // console.log('publicKeyObj::', publicKeyObj);

            // create token
            const token = await createTokenPair({
                payload: { userId: newShop._id, email: newShop.email },
                privateKey,
                publicKey,
            });
            console.log('Created Token Success::', token);

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        obj: newShop,
                    }),
                    token,
                }
            }


        } catch (error) {
            console.error(error);
            return {
                code: 'xxx',
                message: error.message,
                status: 'error',
            }
        }
    };
     
}

module.exports = AccessService;