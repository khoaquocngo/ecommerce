'use strict'

const shopModel = require("../models/shop.model")

class ShopService {
    static findByEmail = async ({ email, select = {
        email: 1, password: 1, name: 1, status: 1, roles: 1
    } }) => {
    
        const shopByEmail = await shopModel
            .findOne({ email })
            .select(select)
            .lean();
    
        return shopByEmail;
    }

    static createShop = async ({
        name, email, password, roles,
    }) => {
        const newShop = await shopModel.create({ name, email, password, roles });
        return newShop.toObject();
    } 
}

module.exports = ShopService