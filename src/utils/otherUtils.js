const _ = require('lodash');

const getInfoData = ({ fields = [], obj = {} }) => {
    return _.pick(obj, fields);
}

const removeNillObject = (obj = {}, isNested = true) => {
    Object.keys(obj).forEach(key => {
        if (_.isNil(obj[key])) {
          delete obj[key];
        } else if (_.isPlainObject(obj[key])) {
            removeNillObject(obj[key])   
        }
      });
    
    return obj;
}


module.exports = {
    getInfoData,
    removeNillObject,
}