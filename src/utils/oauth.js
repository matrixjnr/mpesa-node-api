'use strict';

//encrypt the transactions
var config = require('../config/');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

module.exports.oauth = async function(){
    const b2e = Buffer.from(config.shortcode);
    const data = fs.readFileSync(config.certpath);
    const data1 = String(data);
    const encrypted = crypto.publicEncrypt({
    key: data1,
    padding: crypto.constants.RSA_PKCS1_PADDING
    }, b2e);
    let passcode = encrypted.toString('base64');
    return passcode;
};