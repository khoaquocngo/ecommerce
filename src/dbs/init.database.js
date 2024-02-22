// use strategy pattern
'use strict'
const { countConnect } = require('../helpers/check.connect');

const mongoose = require('mongoose');

const db = require('../configs/config.mongodb');

function initMongodb() {
    if (1 === 1) {
        // mongoose.set('debug', true);
        // mongoose.set('debug', { color: true })
    }

    mongoose.connect(db.connectionStringMongoDb, { maxPoolSize: 50 })
        .then(_ => {
            console.log('🌈 mongoDB::: connected successfully!!')
            countConnect()
        })
        .catch(error => console.log('❌ mongoDB::: connection failed!!', error));
}

const getDatabase = {
    mongodb: initMongodb,
};

class Database {
    constructor() {
        this.connect();
    }

    // Connect
    connect(type = 'mongodb') {
        getDatabase[type]();
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

module.exports = {
    mongoDB: Database.getInstance('mongodb'),
}