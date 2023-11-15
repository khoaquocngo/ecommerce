require('dotenv').config();

const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

const { checkOverload } = require('./helpers/check.connect')

const database = require('./dbs/init.database');

// Init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression())


// Init database
database.mongoDB;
checkOverload()

// Init routers
app.get('/', (req, res, next) => {
    const text = 'Hello World!!';
    return res.status(200).json({
        message: 'Hello World!!',
    })
});

// Handling error

module.exports = app;