'use strict';

//The mpesa module
//Need to find a work around to import routes as a single bundle
const config = require('../src/config/config.js');
const b2c = require('../src/routes/b2cclass.js');
const b2b = require('../src/routes/b2bclass.js');
const bal = require('..src/routes/balclass.js');
const c2b = require('../src/routes/c2bclass.js');
const c2bsimulate =require('../src/routes/c2bclass.js');
const lipanampesa = require('../src/routes/lpmclass.js');
const lnpquery = require('../src/routes/lquery.js');
const reversal = require('../src/routes/revclass.js');
const tstatus = require('../src/routes/statusclass.js');
const util = require('../src/utils/mpesautils.js');

class Mpesa{
    constructor(consumer_key = config.consumer_key, consumer_secret = config.consumer_secret, cert = config.cert, environment = config.environment){
        this.consumer_key = consumer_key;
        this.consumer_secret = consumer_secret;
        this.cert = cert;
        this.environment = environment;
    }
    
    async MpesaB2C(){
        return await b2c;
    };
    async MpesaB2B(){
        return await b2b;
    };
    async MpesaBAL(){
        return await bal;
    };
    async MpesaC2B(){
        return await c2b;
    };
    async MpesaC2Bs(){
        return await c2bsimulate;
    };
    async MpesaBLIPANAMPESA(){
        return await lipanampesa;
    };
    async MpesaLIPAQuery(){
        return await lnpquery;
    };
    async MpesaREVERSAL(){
        return await reversal;
    };
    async MpesaTSTATUS(){
        return await tstatus;
    };
}

module.exports = Mpesa;