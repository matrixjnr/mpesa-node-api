'use strict';

//mother of all classes
//Simply a factory of manufacturing classes

const request = require('request');

class MpesaFactory{
    //constructors for all
    //all derived classes use similar structure but different arguments
    constructor(args = {}){
        //this can be overriden for each derived class
        this.args = args;
    }
    
    async instance(){
        let json = {}; //header values passed to options
        const options = {json};
        const result = await request(options, cb);
        return result;
    };
    
    cb(er, response, body){
        if(!er && response.statusCode === 200){
            const result = JSON.stringify(body);
            return result;
        }
        else{
            console.log("Error!");
        }
    };
}

module.exports = MpesaFactory;