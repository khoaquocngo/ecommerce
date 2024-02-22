const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');

const keyStoryService = require('../services/keyStore.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    REFRESH_TOKEN: 'x-rtoken-id',
    AUTHORIZATION: 'authorization',
};

const createTokenPair = async ({ payload, publicKey, privateKey }) => {
    try {

        // Step 1: create accessToken
        const accessToken = await JWT.sign(payload, publicKey, { expiresIn: '2 days' });

        // Step 2: create refreshToken
        const refreshToken = await JWT.sign(payload, privateKey, { expiresIn: '7 days' });

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
        };
    } catch (error) {
        console.log('error ~ createTokenPair', error.message);
        return null;
    }
};

const verifyJWT = async (token, keySecret) => {
    const payload = await JWT.verify(token, keySecret);

    return payload;
};

const authentication = asyncHandler(async (req, res, next) => {
    // 1 - Check user missing
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
        throw new AuthFailureError('Invalid Request');
    }

    // 2 - Get access token
    const keyStore = await keyStoryService.findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundError('Not found keyStore');
    }

    // 3 - Verify Token
    const [token, keySecret] = req.headers[HEADER.REFRESH_TOKEN]
        ? [req.headers[HEADER.REFRESH_TOKEN], keyStore.privateKey]
        : [req.headers[HEADER.AUTHORIZATION], keyStore.publicKey];

    if (!token) {
        throw new AuthFailureError('Invalid Request');
    }

    try {
        const decodeUser = await verifyJWT(token, keySecret);
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError('Invalid Request');
        }

        req.keyStore = keyStore;
        req.user = decodeUser;
        req.accessToken = req.headers[HEADER.AUTHORIZATION];
        req.refreshToken = req.headers[HEADER.REFRESH_TOKEN];
        return next();
    } catch (error) {
        throw error;
    }
});

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
    };
}

module.exports = {
    createTokenPair,
    authentication,
    generatePublicAndPrivateKey,
    verifyJWT,
};
