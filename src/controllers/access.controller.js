'use strict'

const AccessService = require("../services/access.service");

class AccessController {
    signUp = async (req, res, next) => {
        const result = await AccessService.signUp(req.body);
        return res.status(201).json(result)
    }
}

module.exports = new AccessController();