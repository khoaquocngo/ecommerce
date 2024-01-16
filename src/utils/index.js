const otherUtils = require('./otherUtils');
const httpStatusCode = require('./httpStatusCode');

module.exports = {
    ...otherUtils,
    ...httpStatusCode,
}
