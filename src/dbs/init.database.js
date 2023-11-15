// use strategy pattern
'use strict'
const { countConnect } = require('../helpers/check.connect');

const mongoose = require('mongoose');

const connectString = 'mongodb://localhost:27017/shopDev';


function initMongodb() {
    if (1 === 1) {
        mongoose.set('debug', true);
        mongoose.set('debug', { color: true })
    }

    mongoose.connect(connectString, { maxPoolSize: 50 })
        .then(_ => {
            console.log('🌈 mongoDB::: connected successfully!!')
            countConnect()
        })
        .catch(error => console.log('❌ mongoDB::: connection failed!!'));
}

const getDatabase = {
    mongodb: initMongodb
}


class Database {
    constructor() {
        this.connect();
    }

    // Connect
    connect(type = 'mongodb') {
        getDatabase[type]()
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