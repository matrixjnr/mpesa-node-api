'use strict';

//The mpesa module
const request = require('request');
const config = require('./config');
const util = require('./utils');
var {
    b2b,
    b2c,
    bal,
    c2b,
    c2bsimulate,
    lipanampesa,
    lnpquery,
    reversal,
    tstatus
}= require('./routes');

class Mpesa{
    constructor(key, secret, certPath, environment){
        this.key = key === config.config.consumer_key;
        this.secret = secret === config.config.consumer_secret;
        this.environment = environment === config.config.prefix;
        this.certPath = certPath === config.config.certPath;
        this.baseURL = "https://" + config.config.prefix + "." + config.config.baseURL;
        this.request = request.bind(this);
        this.security = () => {
            return security(this.config.config.certPath, this.util.oauth.passcode);
        };
    }
    
    bal() {
        return bal.bind(this)(...arguments);
    }

    b2b() {
        return b2b.bind(this)(...arguments);
    }

    b2c() {
        return b2c.bind(this)(...arguments);
    }
  
    c2b() {
        return c2b.bind(this)(...arguments);
    }
    c2bsimulate() {
        return c2bsimulate.bind(this)(...arguments);
    }

    lipanampesa () {
        return lipanampesa.bind(this)(...arguments);
    }

    lnpquery () {
        return lnpquery.bind(this)(...arguments);
    }

    reversal () {
        return reversal.bind(this)(...arguments);
    }
          
    tstatus () {
        return tstatus.bind(this)(...arguments);
    }
}