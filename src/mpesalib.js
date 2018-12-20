'use strict';
'use esversion : 6';

//The mpesa module
//Need to find a work around to import routes as a single bundle
const config = require('../src/config/config.js');
const b2c = require('../src/routes/b2cclass.js');
const b2b = require('../src/routes/b2bclass.js');
const bal = require('..src/routes/balclass.js');
const c2b = require('../src/routes/c2bclass.js');
const c2bsimulate = require('../src/routes/c2bclass.js');
const lipanampesa = require('../src/routes/lpmclass.js');
const lnpquery = require('../src/routes/lquery.js');
const reversal = require('../src/routes/revclass.js');
const tstatus = require('../src/routes/statusclass.js');

class Mpesa {
    constructor(consumer_key = config.consumer_key, consumer_secret = config.consumer_secret, cert = config.cert, environment = config.environment) {
        this.consumer_key = consumer_key;
        this.consumer_secret = consumer_secret;
        this.cert = cert;
        this.environment = environment;
    }

    MpesaB2C() {
        return b2c;
    }
    MpesaB2B() {
        return b2b;
    }
    MpesaBAL() {
        return bal;
    }
    MpesaC2B() {
        return c2b;
    }
    MpesaC2Bs() {
        return c2bsimulate;
    }
    MpesaBLIPANAMPESA() {
        return lipanampesa;
    }
    MpesaLIPAQuery() {
        return lnpquery;
    }
    MpesaREVERSAL() {
        return reversal;
    }
    MpesaTSTATUS() {
        return tstatus;
    }
}

module.exports = Mpesa;