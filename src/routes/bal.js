'use strict';

//account balance api

var request = require('request');
var config = require('../config/');
var util = require('../utils/');
//account balance request

module.exports.bal = async function(data){
    const oauth_token = util.oauth_token.token;
    const endpoint = "/mpesa/accountbalance/v1/query"; 
    const url = "https://" + config.prefix + "." + config.baseURL + endpoint;
    const auth = "Bearer " + oauth_token;
    
    data = {
        "Initiator":" ",
        "SecurityCredential":" ",
        "CommandID":"AccountBalance",
        "PartyA":" ",
        "IdentifierType":"4",
        "Remarks":" ",
        "QueueTimeOutURL":"https://ip_address:port/timeout_url",
        "ResultURL":"https://ip_address:port/result_url"
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