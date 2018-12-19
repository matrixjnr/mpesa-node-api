'use strict';

//get the access token

var request = require('request');
var config = require('../config/');
var path = require('path');
var fs = require('fs');

module.exports.oauth_token = async function(){
    var key = fs.readFileSync(config.consumer_key);
    var secret = fs.readFileSync(config.consumer_secret);
    const auth = "Basic " + new Buffer(key + ":" + secret).toString("base64");
    const endpoint = "/oauth/v1/generate?grant_type=client_credentials"; 
    const url = "https://" + config.prefix + "." + config.baseURL + endpoint;
    const options = {
        method : 'GET',
        url : url,
        headers : {
            "Authorization" : auth,
            "Content-Type" : 'application/json'
        }
    };
    
    function cb(er, response, body){
        if(!er && response.statusCode === 200){
            var token = JSON.stringify(body);
        }
        else{
            console.log("Error obtaining access token!");
        }
    };

    return await request(options, cb);
};