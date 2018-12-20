'use strict';

var request = require('request');
var fs = require('fs');
var config = require('../config/config.js');
var crypto = require('crypto');

//get the encryption key and request for access token

function mpesautils(consumer_key, consumer_secret, cert, url){
    this.key = consumer_key;
    this.secret = consumer_secret;
    this.cert = cert;
    this.url = url;

    function passcode(){
        const b2e = Buffer.from(config.shortcode);
        const data = fs.readFileSync(config.certpath);
        const data1 = String(data);
        const encrypted = crypto.publicEncrypt({
        key: data1,
        padding: crypto.constants.RSA_PKCS1_PADDING
        }, b2e);
        const passcode = encrypted.toString('base64');
        return passcode;
    }

    async function authenticate(){
        const consumer_key = fs.readFileSync(config.consumer_key);
        const consumer_secret = fs.readFileSync(config.consumer_secret);
        const auth = "Basic " + new Buffer(consumer_key + ":" + consumer_secret).toString("base64");

        const options = {
            method: 'GET',
            url: mpesautils.url,
            headers: {
                "Authorization": auth,
                "Content-Type": 'application/json'
            }
        };

        function cb(er, response, body) {
            if (!er && response.statusCode === 200) {
                const result = JSON.stringify(body);
                return result;
            } else {
                const result = 'Error obtaining access tokens';
                return result;
            }
        }

        const access_tokens = await request(options, cb);

        return access_tokens;
    }
}

mpesautils.key = config.consumer_key;
mpesautils.secret = config.consumer_secret;
mpesautils.cert = config.cert;
mpesautils.url = 'htpps://' + config.environment + '.' + 'safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

module.exports = mpesautils.authenticate();