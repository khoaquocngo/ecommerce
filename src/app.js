require('dotenv').config();

const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const Router = require('./routes');

const app = express();

const { checkOverload } = require('./helpers/check.connect')

const database = require('./dbs/init.database');

// Init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}))


// Init database
database.mongoDB;
checkOverload()

// Init routers
app.use('/', Router);

// Handling error

module.exports = app;