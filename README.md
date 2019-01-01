[![Build Status](https://travis-ci.org/matrixjnr/mpesa-node-api.svg?branch=master)](https://travis-ci.org/matrixjnr/mpesa-node-api)
[![Maintainability](https://api.codeclimate.com/v1/badges/d8ac8839553e770816e5/maintainability)](https://codeclimate.com/github/matrixjnr/mpesa-node-api/maintainability)
[![Dependency Status](https://david-dm.org/matrixjnr/mpesa-node-api.svg)](https://david-dm.org/matrixjnr/mpesa-node-api)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/matrixjnr/mpesa-node-api/issues)
[![Known Vulnerabilities](https://snyk.io/test/github/matrixjnr/mpesa-node-api/badge.svg?targetFile=package.json)](https://snyk.io/test/github/matrixjnr/mpesa-node-api?targetFile=package.json)
![Licence](https://img.shields.io/github/license/matrixjnr/mpesa-node-api.svg)

# Mpesa-Node-API(mpesalib)

mpesalib is a Node.js library for Safaricom Daraja API
Made for OOP developers with love. You don't need to know the architecture of the Daraja API, just import the functions and pass correct arguments to the function and implement a method that returns a response from function.instance.

## Requirements

1. Node v10+ recommended.
2. npm v6
3. ES7/ES6 foundation

You need the following for the .env file all are optional as you can pass them directly as arguments:
1. Consumer Key and Consume Secret
2. Test Credentials
3. API prefix which is the environment
4. Certificate Path
5. Short Code, Phone Number and anything that can be passed to the configuration file

## Installation

Download the source code and install locally using npm
Use the node package manager to install mpesalib

```bash
npm install mpesalib
```

## Usage

```node
'use strict';
var Mpesa = require('mpesalib');
//create a new instance
var MpesaApp = new Mpesa();

await MpesaApp.MpesaC2Bs(901292, 254798283876, 1000, 'ref-id');

```

## Importing Specific functions

```node
'use strict';
//imports the b2b mpesa api
var Mpesa = require('mpesalib').MpesaB2B;
```

## Not Done

-  Tests
-  Detailed Documentation
-  Data validation
-  Code Refactoring

## Contributing
1. Create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull request :D

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

I did not write tests so if you wish you can include tests for existing functions.
Please make sure to update tests as appropriate.
