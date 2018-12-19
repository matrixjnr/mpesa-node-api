'use strict';

var request = require('request');
var config = require('../config/');
var util = require('../utils/');
//b2c request

module.exports = async function(data){
    const oauth_token = util.oauth_token.token;
    const endpoint = "/mpesa/b2c/v1/paymentrequest"; 
    const url = "https://" + config.prefix + "." + config.baseURL + endpoint;
    const auth = "Bearer " + oauth_token;
    
    data = {
        "InitiatorName": " ",
        "SecurityCredential":" ",
        "CommandID": " ",
        "Amount": " ",
        "PartyA": " ",
        "PartyB": " ",
        "Remarks": " ",
        "QueueTimeOutURL": "http://your_timeout_url",
        "ResultURL": "http://your_result_url",
        "Occasion": " "
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