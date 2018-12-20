'use strict';
//c2b
var MpesaFactory = require('../instance/instance.js');
const access_token = require('../utils/mpesautils.js');
const config = require('../config/config.js');

class c2bclass extends MpesaFactory{
    constructor(ShortCode, ResponseType, ConfirmationURL, ValidationURL){
        super();
        this.ShortCode = ShortCode; //Username
        this.ResponseType = ResponseType;
        this.ConfirmationURL = ConfirmationURL;
        this.ValidationURL = ValidationURL;
    }
    async instance(){
        const url = "https://" + config.environment + "." + "safaricom.co.ke/mpesa/c2b/v1/registerurl";
        const auth = "Bearer " + access_token;
        let json = {
            "ShortCode": ShortCode,
            "ResponseType": ResponseType,
            "ConfirmationURL": ConfirmationURL,
            "ValidationURL": ValidationURL
        }; //header values passed to options
        const options = {
            method : 'POST',
            url : url,
            headers : {
                "Authorization" : auth,
                "Content-Type" : 'application/json'
            },
            json : json
        };
        const result = await request(options, cb);
        return result;
    };
    
    cb(er, response, body){
        if(!er && response.statusCode === 200){
            const result = JSON.stringify(body);
            return result;
        }
        else{
            console.log("Error processing transaction!");
        }
    };
    
};

module.exports = c2bclass;