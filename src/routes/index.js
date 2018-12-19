'use strict';

var b2c = require('./b2c.js');
var b2b = require('./b2b.js');
var bal = require('./bal.js');
var c2b = require('./c2b.js');
var c2bsimulate =require('./c2bsimulate.js');
var lipanampesa = require('./lipanampesa.js');
var lnpquery = require('./lnpquery.js');
var reversal = require('./reversal.js');
var tstatus = require('./status');

module.exports.routes = {
    b2b,
    b2c,
    bal,
    c2b,
    c2bsimulate,
    lipanampesa,
    lnpquery,
    reversal,
    tstatus
};