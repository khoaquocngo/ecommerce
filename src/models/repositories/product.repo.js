'use strict'

const { product, electronic, clothing, furniture } = require('../product.model');

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    const products = await queryProduct({ query, limit, skip })
    return products;
}

const findAllPublishForShop = async ({query, limit, skip}) => {
    const products = await queryProduct({ query, limit, skip })
    return products;
}

const publishProductByShop = async ({ productShop, productId }) => {
    const foundShop = await product.findOne({
        _id: productId,
        productShop: productShop,
        isDraft: true,
    })

    if (!foundShop) return null;

    const { modifiedCount } = await product.updateOne({ _id: productId }, {
        isDraft: false,
        isPublished: true,
    })
    
    return !!modifiedCount;
}


const unPublishProductByShop = async ({ productShop, productId }) => {
    const foundShop = await product.findOne({
        _id: productId,
        productShop: productShop,
        isPublished: true
    })

    if (!foundShop) return null;

    const { modifiedCount } = await product.updateOne({ _id: productId }, {
        isDraft: true,
        isPublished: false,
    })
    
    return !!modifiedCount;
}

const queryProduct = async({ query, limit, skip }) => {
    const products = await product
    .find(query)
    .populate('productShop', 'name email')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean();

    return products;
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product
    .find(
        { 
            $text: { $search: regexSearch },
            isPublished: true,
        },
        { score: { $meta: 'textScore' }},
    )
    .sort({ score: { $meta: "textScore" } })
    .lean()

    return results;
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

    const products = await product
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(select)
        .lean();

    return products;
}

const findProduct = async ({ id, unSelect }) => {
    const getProduct = await product
        .findById(id)
        .select(unSelect)
        .lean();

    return getProduct;
}

const updateProductById = async ({
    productId,
    payload,
    model,
    isNew = true,
}) => {   
    const product = await model
        .findByIdAndUpdate(productId, payload, { new: isNew })
        .lean();
    return product;
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
} 