'use strict';
//reverse transaction
var MpesaFactory = require('../instance/instance.js');
const access_token = require('../utils/mpesautils.js');
const config = require('../config/config.js');

class rclass extends MpesaFactory{
    constructor(Initiator, SecurityCredential, CommandID='TransactionReversal', TransactionID, Amount, ReceiverParty, RecieverIdentifierType='4', ResultURL, QueueTimeOutURL, Remarks, Occasion) {
        super();
        this.Initiator = Initiator; //Username
        this.SecurityCredential = SecurityCredential;
        this.CommandID = CommandID;
        this.TransactionID = TransactionID;
        this.Amount = Amount;
        this.ReceiverParty = ReceiverParty;
        this.RecieverIdentifierType = RecieverIdentifierType;
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
            "Amount": Amount,
            "ReceiverParty": ReceiverParty,
            "RecieverIdentifierType": RecieverIdentifierType,
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

module.exports = rclass;