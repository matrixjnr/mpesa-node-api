'use strict';
//b2c
var MpesaFactory = require('../instance/instance.js');
const access_token = require('../utils/mpesautils.js').authenticate;
const config = require('../config/config.js');

class b2cclass extends MpesaFactory{
    constructor(InitiatorName, SecurityCredential, CommandID='BusinessPayment', Amount, PartyA, PartyB, Remarks, QueueTimeOutURL, ResultURL, Occasion) {
        super();
        this.InitiatorName = InitiatorName; //Username
        this.SecurityCredential = SecurityCredential;
        this.CommandID = CommandID;
        this.Amount = Amount;
        this.PartyA = PartyA; //Sender shortcode
        this.PartyB = PartyB; //Receiver shortcode
        this.Remarks = Remarks; //Message to attach
        this.QueueTimeOutURL = QueueTimeOutURL;
        this.ResultURL = ResultURL;
        this.Occasion = Occasion;
        
    }
    async instance() {
        const url = "https://" + config.environment + "." + "safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
        const auth = "Bearer " + access_token;
        let json = {
            "InitiatorName": InitiatorName,
            "SecurityCredential": SecurityCredential,
            "CommandID": CommandID,
            "Amount": Amount,
            "PartyA": PartyA,
            "PartyB": PartyB,
            "Remarks": Remarks,
            "QueueTimeOutURL": QueueTimeOutURL,
            "ResultURL": ResultURL,
            "Occasion": Occasion
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

module.exports = b2cclass;