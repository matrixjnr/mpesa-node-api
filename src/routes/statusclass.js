'use strict';
//Check transaction status
var MpesaFactory = require('../instance/instance.js');
const access_token = require('../utils/mpesautils.js');
const config = require('../config/config.js');

class statusclass extends MpesaFactory{
    constructor(Initiator, SecurityCredential, CommandID='TransactionStatusQuery', TransactionID, PartyA, IdentifierType='1', ResultURL, QueueTimeOutURL, Remarks, Occasion) {
        super();
        this.Initiator = Initiator; //Username
        this.SecurityCredential = SecurityCredential;
        this.CommandID = CommandID;
        this.TransactionID = TransactionID;
        this.PartyA = PartyA;
        this.IdentifierType = IdentifierType;
        this.Remarks = Remarks; //Message to attach
        this.QueueTimeOutURL = QueueTimeOutURL;
        this.ResultURL = ResultURL;
        this.Occasion = Occasion;
    }
    async instance() {
        const url = "https://" + config.environment + "." + "safaricom.co.ke/mpesa/reversal/v1/request";
        const auth = "Bearer " + access_token;
        const json = {
            "Initiator": Initiator,
            "SecurityCredential": SecurityCredential,
            "CommandID": CommandID,
            "TransactionID": TransactionID,
            "PartyA": PartyA,
            "IdentifierType": IdentifierType,
            "ResultURL": ResultURL,
            "QueueTimeOutURL": QueueTimeOutURL,
            "Remarks": Remarks,
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

module.exports = statusclass;