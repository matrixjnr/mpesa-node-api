'use strict';
//lipa na mpesa online
var MpesaFactory = require('../instance/instance.js');
const access_token = require('../utils/mpesautils.js').authenticate;
const config = require('../config/config.js');

class lpmclass extends MpesaFactory{
    constructor(BusinessShortCode, Password, Timestamp, TransactionType='CustomerPayBillOnline', Amount, PartyA, PartyB, PhoneNumber, CallBackURL, AccountReference, TransactionDesc) {
        super();
        this.BusinessShortCode = BusinessShortCode;
        this.Password = Password;
        this.Timestamp = Timestamp;
        this.TransactionType = TransactionType;
        this.Amount = Amount;
        this.PartyA = PartyA;
        this.PartyB = PartyB;
        this.PhoneNumber = PhoneNumber;
        this.CallBackURL = CallBackURL;
        this.AccountReference = AccountReference;
        this.TransactionDesc = TransactionDesc;
    }
    async instance() {
        const url = "https://" + config.environment + "." + "safaricom.co.ke/mpesa/stkpush/v1/processrequest";
        const auth = "Bearer " + access_token;
        const json = {
            "BusinessShortCode": BusinessShortCode,
            "Password": Password,
            "Timestamp": Timestamp,
            "TransactionType": TransactionType,
            "Amount": Amount,
            "PartyA": PartyA,
            "PartyB": PartyB,
            "PhoneNumber": PhoneNumber,
            "CallBackURL": CallBackURL,
            "AccountReference": AccountReference, //
            "TransactionDesc": TransactionDesc //Transaction Description
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

module.exports = lpmclass;