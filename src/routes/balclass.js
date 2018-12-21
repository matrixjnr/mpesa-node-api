'use strict';
//account balance
var MpesaFactory = require('../instance/instance.js');
const access_token = require('../utils/mpesautils.js').authenticate;
const config = require('../config/config.js');

class balclass extends MpesaFactory{
    constructor(Initiator, SecurityCredential, CommandID='AccountBalance', PartyA, IdentifierType='4', Remarks, QueueTimeOutURL, ResultURL, Occasion) {
        super();
        this.Initiator = Initiator; //Username
        this.SecurityCredential = SecurityCredential;
        this.CommandID = CommandID;
        this.PartyA = PartyA; //Sender shortcode
        this.IdentifierType = IdentifierType; //Receiver shortcode
        this.Remarks = Remarks; //Message to attach
        this.QueueTimeOutURL = QueueTimeOutURL;
        this.ResultURL = ResultURL;
        this.Occasion = Occasion;
        
    }
    async instance() {
        const url = "https://" + config.environment + "." + "safaricom.co.ke/mpesa/accountbalance/v1/query";
        const auth = "Bearer " + access_token;
        let json = {
            "Initiator": Initiator,
            "SecurityCredential": SecurityCredential,
            "CommandID": CommandID,
            "PartyA": PartyA,
            "IdentifierType": IdentifierType,
            "Remarks": Remarks,
            "QueueTimeOutURL":QueueTimeOutURL,
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

module.exports = balclass;