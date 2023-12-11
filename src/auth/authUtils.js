'use strict'

const JWT = require('jsonwebtoken');

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
        
    }
}

module.exports = {
    createTokenPair,
}