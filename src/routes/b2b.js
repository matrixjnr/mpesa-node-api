'use strict';

//b2b api

var request = require('request');
var config = require('../config/');
var util = require('../utils/');
//b2b request

module.exports.b2b = async function(data){
    const oauth_token = util.oauth_token.token;
    const endpoint = "/mpesa/b2b/v1/paymentrequest"; 
    const url = "https://" + config.prefix + "." + config.baseURL + endpoint;
    const auth = "Bearer " + oauth_token;
    
    data = {
        "Initiator": " ",
        "SecurityCredential": " ",
        "CommandID": " ",
        "SenderIdentifierType": " ",
        "RecieverIdentifierType": " ",
        "Amount": " ",
        "PartyA": " ",
        "PartyB": " ",
        "AccountReference": " ",
        "Remarks": " ",
        "QueueTimeOutURL": "http://your_timeout_url",
        "ResultURL": "http://your_result_url"
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