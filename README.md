# Mpesa-Node-API(mpesalib)

mpesalib is a Node.js library for Safaricom Daraja API

[![Known Vulnerabilities](https://snyk.io/test/github/matrixjnr/mpesa-node-api/badge.svg?targetFile=package.json)](https://snyk.io/test/github/matrixjnr/mpesa-node-api?targetFile=package.json)

## Requirements

1. Node v10+ recommended.
2. Yarn* (optional) You can still use npm
3. ES7 knowledge

You need the following for the .env file:
1. Consumer Key and Consume Secret
2. Test Credentials *(Optional only for sandbox)*
3. API prefix which is the environment
4. Certificate Path
5. Short Code, Phone Number and anything that can be passed to the configuration file

## Installation

Use the node package manager to install mpesalib

```bash
npm install mpesalib
```

## Usage

```node
'use strict';
var Mpesa = require('mpesalib');
//You can pass as many arguments to Mpesa()
var mpesaAPP = new Mpesa({
    key: config.config.consumer_key,
    secret: config.config.consumer_secret,
    environment: config.config.prefix,
    certPath: config.config.certPath
})

await mpesaApp
    .c2bsimulate(data ={
        687576,
        1000,
        254798283876,
        'ref-id'}
    );
```

## Importing Specific functions

```node
'use strict';
var Mpesa = require('mpesalib').lipanampesa;
```

## Pending Stuff

- [ ] E2E Integration Tests
- [ ] Detailed Documentation
- [ ] Enumify
- [ ] Validators for MSISDN and other expected inputs
- [ ] More detailed Unit tests

## Contributing
1. Create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull request :D

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

I did not write tests so if you wish you can include tests for existing functions.
Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
