'use strict';

//lipa na mpesa query api

var request = require('request');
var config = require('../config/');
var util = require('../utils/');
//lipa na mpesa query request

module.exports.lquery = async function(data){
    const oauth_token = util.oauth_token.token;
    const endpoint = "/mpesa/stkpushquery/v1/query"; 
    const url = "https://" + config.prefix + "." + config.baseURL + endpoint;
    const auth = "Bearer " + oauth_token;
    
    data = {
        "BusinessShortCode": " " ,
        "Password": " ",
        "Timestamp": " ",
        "CheckoutRequestID": " "
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
