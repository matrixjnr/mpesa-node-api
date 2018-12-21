'use strict';
//lipa na mpesa query
var MpesaFactory = require('../instance/instance.js');
const access_token = require('../utils/mpesautils.js').authenticate;
const config = require('../config/config.js');

class lqclass extends MpesaFactory{
    constructor(BusinessShortCode, Password, Timestamp, CheckoutRequestID) {
        super();
        this.BusinessShortCode = BusinessShortCode;
        this.Password = Password;
        this.Timestamp = Timestamp;
        this.CheckoutRequestID = CheckoutRequestID;
    }
    async instance() {
        const url = "https://" + config.environment + "." + "safaricom.co.ke/mpesa/stkpushquery/v1/query";
        const auth = "Bearer " + access_token;
        const json = {
            "BusinessShortCode": BusinessShortCode,
            "Password": Password,
            "Timestamp": Timestamp,
            "CheckoutRequestID": CheckoutRequestID
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
    
    cb(er, response, body) {
        if(!er && response.statusCode === 200){
            const result = JSON.stringify(body);
            return result;
        }
        else{
            console.log("Error processing transaction!");
        }
    };
    
}

module.exports = lqclass;