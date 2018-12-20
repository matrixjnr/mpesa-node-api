'use strict';
//c2b simulate
var MpesaFactory = require('../instance/instance.js');
const access_token = require('../utils/mpesautils.js');
const config = require('../config/config.js');

class c2bsclass extends MpesaFactory{
    constructor(ShortCode, CommandID='CustomerPayBillOnline', Amount, Msisdn, BillRefNumber) {
        super();
        this.ShortCode = ShortCode; //Username
        this.CommandID = CommandID;
        this.Amount = Amount;
        this.Msisdn = Msisdn;
        this.BillRefNumber = BillRefNumber;
    }
    async instance() {
        const url = "https://" + config.environment + "." + "safaricom.co.ke/mpesa/c2b/v1/registerurl";
        const auth = "Bearer " + access_token;
        const json = {
            "ShortCode": ShortCode,
            "CommandID": CommandID,
            "Amount": Amount,
            "Msisdn": Msisdn,
            "BillRefNumber": BillRefNumber
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

module.exports = c2bsclass;