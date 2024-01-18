'use strict'

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');

const { findByUserId} = require('../services/keyStore.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}

const createTokenPair = async ({ payload, publicKey, privateKey }) => {
    try {
        // Step 1: create accessToken
        const accessToken = await JWT.sign(payload, publicKey, { expiresIn: '2 days' });

        // Step 2: create refreshToken
        const refreshToken = await JWT.sign(payload, privateKey, { expiresIn: '7 days' })

        JWT.verify(accessToken, publicKey, (error, decode) => {
            if (error) {
                console.error('error verify::', error);
            } else {
                console.log('decode verify::', decode);
            }
        });

        return {
            accessToken,
            refreshToken,
        }
    } catch (error) {
        console.log('error ~ createTokenPair', error.message)
    }
}

const authentication = asyncHandler( async (req, res, next) => {
    // 1 - Check user missing
    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId) {
        throw new AuthFailureError('Invalid Request');
    }

    // 2 - Get access token
    const keyStore = await findByUserId(userId);
    if(!keyStore) {
        throw new NotFoundError('Not found keyStore');
    }

    // 3 - Verify Token
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) {
        throw new AuthFailureError('Invalid Request');
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId != decodeUser.userId) {
            throw new AuthFailureError('Invalid Request');
        }
        req.keyStore = keyStore;
        return next();
    } catch(error) {
        throw error;
    }
})

module.exports = {
    createTokenPair,
    authentication,
}