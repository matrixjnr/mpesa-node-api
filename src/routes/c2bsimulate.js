'use strict';

//c2bsimulate api

var request = require('request');
var config = require('../config/');
var util = require('../utils/');
//c2b simulate request i.e lipa na mpesa

module.exports.c2bsimulate = async function(data){
    const oauth_token = util.oauth_token.token;
    const endpoint = "/mpesa/c2b/v1/simulate"; 
    const url = "https://" + config.prefix + "." + config.baseURL + endpoint;
    const auth = "Bearer " + oauth_token;
    
    data = {
        "ShortCode":" ",
        "CommandID":"CustomerPayBillOnline",
        "Amount":" ",
        "Msisdn":" ",
        "BillRefNumber":" "
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