'use strict';
//b2b
var MpesaFactory = require('../instance/instance.js');
const access_token = require('../utils/mpesautils.js');
const config = require('../config/config.js');

class b2bclass extends MpesaFactory{
    constructor(Initiator, SecurityCredentials, CommandID='BusinessPayBill', SenderIdentifierType, RecieverIdentifierType, Amount, PartyA, PartyB, AccountReference, Remarks, QueueTimeOutURL, ResultURL) {
        super();
        this.Initiator = Initiator; //Username
        this.SecurityCredentials = SecurityCredentials;
        this.CommandID = CommandID;
        this.SenderIdentifierType = SenderIdentifierType;//Sender name
        this.RecieverIdentifierType = RecieverIdentifierType;//Receiver name
        this.Amount = Amount;
        this.PartyA = PartyA; //Sender shortcode
        this.PartyB = PartyB; //Receiver shortcode
        this.AccountReference = AccountReference; //Ref no
        this.Remarks = Remarks; //Message to attach
        this.QueueTimeOutURL = QueueTimeOutURL;
        this.ResultURL = ResultURL;
        
    }
    async instance() {
        const url = "https://" + config.environment + "." + "safaricom.co.ke/mpesa/b2b/v1/paymentrequest";
        const auth = "Bearer " + access_token;
        let json = {
            "Initiator": Initiator,
            "SecurityCredential": SecurityCredentials,
            "CommandID": CommandID,
            "SenderIdentifierType": SenderIdentifierType,
            "RecieverIdentifierType": RecieverIdentifierType,
            "Amount": Amount,
            "PartyA": PartyA,
            "PartyB": PartyB,
            "AccountReference": AccountReference,
            "Remarks": Remarks,
            "QueueTimeOutURL": QueueTimeOutURL,
            "ResultURL": ResultURL
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

module.exports = b2bclass;