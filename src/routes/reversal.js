'use strict';

//reverse transaction api

var request = require('request');
var config = require('../config/');
var util = require('../utils/');
//reversal request

module.exports.reverse = async function(data){
    const oauth_token = util.oauth_token.token;
    const endpoint = "/mpesa/reversal/v1/request"; 
    const url = "https://" + config.prefix + "." + config.baseURL + endpoint;
    const auth = "Bearer " + oauth_token;
    
    data = {
        "Initiator":" ",
        "SecurityCredential":" ",
        "CommandID":"TransactionReversal",
        "TransactionID":" ",
        "Amount":" ",
        "ReceiverParty":" ",
        "RecieverIdentifierType":"4",
        "ResultURL":"https://ip_address:port/result_url",
        "QueueTimeOutURL":"https://ip_address:port/timeout_url",
        "Remarks":" ",
        "Occasion":" "
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
