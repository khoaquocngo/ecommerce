'use strict'

const { SuccessResponse, CREATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    signIn = async (req, res, next) => {
        const metadata = await AccessService.signIn(req.body);
        new SuccessResponse({
            metadata
        }).send(res);
    }

    signUp = async (req, res, next) => {
        const metadata = await AccessService.signUp(req.body);
        new CREATED({
            metadata,
            options: {
                limit: 10,
            }
        }).send(res);
    }
}

module.exports = new AccessController();