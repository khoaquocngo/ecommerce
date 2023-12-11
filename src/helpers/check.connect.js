'use strict'

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECOND = 5000;

// Count connect mongodb
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`🌈 mongoDB::: number of connects ${numConnection}`)
}

// Check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // log info
        // console.log(`ℹ️  mongoDB::: active connections ${numConnection}`);
        // console.log(`ℹ️  mongoDB::: memory usage ${memoryUsage / 1024 / 1024} MB`);

        /*
            admin db
            var status = db.serverStatus()
            status.connections
        */

        // Example maximum number of connections based on number osf cores
        const maxConnections = numCores * 90;
        if (numConnection > maxConnections) {
            console.log('❌ mongoDB::: connection overload detected!');
            // notify when connection overload
            // notify.send(...)
        }

    }, _SECOND); // Monitor ever 5 seconds
}

module.exports = {
    countConnect,
    checkOverload,
}