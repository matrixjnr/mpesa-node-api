'use strict';

//check transaction status api

var request = require('request');
var config = require('../config/');
var util = require('../utils/');
//transaction status request

module.exports.tstatus = async function(data){
    const oauth_token = util.oauth_token.token;
    const endpoint = "/mpesa/transactionstatus/v1/query"; 
    const url = "https://" + config.prefix + "." + config.baseURL + endpoint;
    const auth = "Bearer " + oauth_token;
    
    data = {
        "Initiator":" ",
        "SecurityCredential":" ",
        "CommandID":"TransactionStatusQuery",
        "TransactionID":" ",
        "PartyA":" ",
        "IdentifierType":"1",
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
