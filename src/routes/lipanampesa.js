'use strict';

//lipa na mpesa online api

var request = require('request');
var config = require('../config/');
var util = require('../utils/');
//lipa na mpesa online stk push request

module.exports.lipa = async function(data){
    const oauth_token = util.oauth_token.token;
    const endpoint = "/mpesa/stkpush/v1/processrequest"; 
    const url = "https://" + config.prefix + "." + config.baseURL + endpoint;
    const auth = "Bearer " + oauth_token;
    
    data = {
        "BusinessShortCode": " ",
        "Password": " ",
        "Timestamp": " ",
        "TransactionType": "CustomerPayBillOnline",
        "Amount": " ",
        "PartyA": " ",
        "PartyB": " ",
        "PhoneNumber": " ",
        "CallBackURL": "https://ip_address:port/callback",
        "AccountReference": " ",
        "TransactionDesc": " "
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
