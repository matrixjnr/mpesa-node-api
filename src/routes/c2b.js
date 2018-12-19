'use strict';

//c2b api

var request = require('request');
var config = require('../config/');
var util = require('../utils/');
//c2b request

module.exports.c2b = async function(data){
    const oauth_token = util.oauth_token.token;
    const endpoint = "/mpesa/c2b/v1/registerurl"; 
    const url = "https://" + config.prefix + "." + config.baseURL + endpoint;
    const auth = "Bearer " + oauth_token;
    
    data = {
        "ShortCode": " ",
        "ResponseType": " ",
        "ConfirmationURL": "http://ip_address:port/confirmation",
        "ValidationURL": "http://ip_address:port/validation_url"
    };
    
    const options = {
        method : 'POST',
        url : url,
        headers : {
            "Authorization" : auth,
            "Content-Type" : 'application/json'
        },
        json : data
    };
    
    function cb(er, response, body){
        if(!er && response.statusCode === 200){
            var info = JSON.stringify(body);
        }
        else{
            console.log("Error!");
        }
    };

    return await request(options, cb);
};