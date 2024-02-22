'use strict'

const { SuccessResponse, CREATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    refreshToken = async (req, res, next) => {
        const metadata = await AccessService.handleRefreshToken(req);
        new SuccessResponse({
            message: 'Get Token success!!',
            metadata,
        }).send(res);    }

    signOut = async (req, res, next) => {
        await AccessService.signOut({ userId: req.user.userId, refreshToken: req.refreshToken });
        new SuccessResponse({
            message: 'Sign out success!',
        }).send(res);
    }

    signIn = async (req, res, next) => {
        const metadata = await AccessService.signIn(req.body);
        new SuccessResponse({
            message: 'Sign in success',
            metadata,
        }).send(res);
    }

    signUp = async (req, res, next) => {
        const metadata = await AccessService.signUp(req.body);
        new CREATED({
            message: 'Sign up success',
            metadata,
        }).send(res);
    }
}

module.exports = new AccessController();