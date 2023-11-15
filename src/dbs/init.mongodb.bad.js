/* 
    Nhược điểm ::: nếu không sử dụng ở môi trường node sẽ tạo ra nhiều kết nói ==> quá tải
    Nodejs không bị vì require đã cache
*/

'use strict'

const { countConnect } = require('../helpers/check.connect')

const mongoose = require('mongoose');

const connectString = 'mongodb://localhost:27017/shopDev';
mongoose.connect(connectString)
    .then(_ => console.log('🌈 mongoDB::: connected successfully!!', countConnect()))
    .catch(error => {
        console.log('❌ mongoDB::: connection failed!!')
    });

// dev
if (1 === 1) {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true })
}

module.exports = mongoose;