# M-Pesa Daraja API - Node.js Library

[![npm version](https://badge.fury.io/js/mpesalib.svg)](https://badge.fury.io/js/mpesalib)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/matrixjnr/mpesa-node-api/workflows/CI/badge.svg)](https://github.com/matrixjnr/mpesa-node-api/actions)
[![Known Vulnerabilities](https://snyk.io/test/github/matrixjnr/mpesa-node-api/badge.svg?targetFile=package.json)](https://snyk.io/test/github/matrixjnr/mpesa-node-api?targetFile=package.json)
[![Coverage Status](https://coveralls.io/repos/github/matrixjnr/mpesa-node-api/badge.svg?branch=main)](https://coveralls.io/github/matrixjnr/mpesa-node-api?branch=main)

A robust, modern Node.js library for integrating with Safaricom's M-Pesa Daraja API. Built with TypeScript, comprehensive error handling, and extensive testing.

## Features

- 🚀 **Modern TypeScript** - Full TypeScript support with comprehensive type definitions
- 🔒 **Secure** - Built-in security credential generation and token management
- 🛡️ **Error Handling** - Comprehensive error handling and validation
- 📝 **Well Documented** - Extensive documentation and examples
- 🧪 **Thoroughly Tested** - 95%+ test coverage
- 🔄 **Retry Logic** - Built-in retry mechanism for network failures
- 📱 **Phone Number Formatting** - Automatic phone number formatting and validation
- 🌍 **Environment Support** - Support for both sandbox and production environments
- 📊 **Callback Handling** - Built-in utilities for handling M-Pesa callbacks

## Supported APIs

- ✅ **STK Push** (Lipa Na M-Pesa Online)
- ✅ **STK Push Query** (Check payment status)
- ✅ **C2B Register URLs** (Customer to Business)
- ✅ **C2B Simulate** (Test C2B payments)
- ✅ **B2C Payment** (Business to Customer)
- ✅ **B2B Payment** (Business to Business)
- ✅ **Account Balance** (Check account balance)
- ✅ **Transaction Status** (Query transaction status)
- ✅ **Transaction Reversal** (Reverse transactions)

## Installation

```bash
npm install mpesalib
```

> **⚠️ Upgrading from v1.x?** This is a complete rewrite with breaking changes. See the [Migration Guide](./MIGRATION.md) for detailed upgrade instructions.

## Quick Start

### 1. Configuration

Create a `.env` file based on `.env.example`:

```env
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_ENVIRONMENT=sandbox
MPESA_SHORT_CODE=174379
MPESA_PASSKEY=your_passkey
```

### 2. Basic Usage

```typescript
import { Mpesa } from 'mpesalib';

// Initialize from environment variables
const mpesa = Mpesa.fromEnv();

// Or initialize with config object
const mpesa = new Mpesa({
  consumerKey: 'your_consumer_key',
  consumerSecret: 'your_consumer_secret',
  environment: 'sandbox',
  shortCode: '174379',
  passkey: 'your_passkey',
});

// STK Push (Customer Payment)
const response = await mpesa.paybillPayment(
  1000,                           // Amount
  '254712345678',                 // Phone number
  'INV001',                       // Account reference
  'Payment for services',         // Description
  'https://yourdomain.com/callback' // Callback URL
);

console.log(response);
```

## API Reference

### STK Push (Lipa Na M-Pesa Online)

Initiate a payment request to customer's phone:

```typescript
// Paybill payment
const response = await mpesa.paybillPayment(
  amount,
  phoneNumber,
  accountReference,
  description,
  callbackURL
);

// Buy goods payment
const response = await mpesa.buyGoodsPayment(
  amount,
  phoneNumber,
  accountReference,
  description,
  callbackURL
);

// Custom STK Push
const response = await mpesa.stkPush({
  BusinessShortCode: '174379',
  TransactionType: 'CustomerPayBillOnline',
  Amount: 1000,
  PartyA: '254712345678',
  PartyB: '174379',
  PhoneNumber: '254712345678',
  CallBackURL: 'https://yourdomain.com/callback',
  AccountReference: 'TEST001',
  TransactionDesc: 'Test payment',
});
```

### STK Push Query

Check the status of an STK Push request:

```typescript
const status = await mpesa.stkPushQuery('ws_CO_12345678');
```

### C2B (Customer to Business)

Register callback URLs and simulate C2B transactions:

```typescript
// Register URLs
await mpesa.registerC2BUrls({
  ShortCode: '600000',
  ResponseType: 'Completed',
  ConfirmationURL: 'https://yourdomain.com/confirmation',
  ValidationURL: 'https://yourdomain.com/validation',
});

// Simulate C2B payment
await mpesa.simulateC2B({
  ShortCode: '600000',
  CommandID: 'CustomerPayBillOnline',
  Amount: 1000,
  Msisdn: '254712345678',
  BillRefNumber: 'INV001',
});
```

### B2C (Business to Customer)

Send money to customers:

```typescript
// Business payment
await mpesa.businessPayment(
  5000,
  '254712345678',
  'Business payment',
  'https://yourdomain.com/timeout',
  'https://yourdomain.com/result'
);

// Salary payment
await mpesa.salaryPayment(
  50000,
  '254712345678',
  'Monthly salary',
  'https://yourdomain.com/timeout',
  'https://yourdomain.com/result'
);

// Custom B2C
await mpesa.b2cPayment({
  InitiatorName: 'testapi',
  SecurityCredential: 'credential',
  CommandID: 'BusinessPayment',
  Amount: 1000,
  PartyA: '600000',
  PartyB: '254712345678',
  Remarks: 'Payment',
  QueueTimeOutURL: 'https://yourdomain.com/timeout',
  ResultURL: 'https://yourdomain.com/result',
});
```

### B2B (Business to Business)

Transfer money between businesses:

```typescript
await mpesa.b2bPayment({
  InitiatorName: 'testapi',
  SecurityCredential: 'credential',
  CommandID: 'BusinessPayBill',
  Amount: 1000,
  PartyA: '600000',
  PartyB: '600001',
  RecieverIdentifierType: 4,
  Remarks: 'B2B Payment',
  QueueTimeOutURL: 'https://yourdomain.com/timeout',
  ResultURL: 'https://yourdomain.com/result',
  AccountReference: 'TEST001',
});
```

### Account Balance

Check account balance:

```typescript
await mpesa.getAccountBalance({
  InitiatorName: 'testapi',
  SecurityCredential: 'credential',
  CommandID: 'AccountBalance',
  PartyA: '600000',
  IdentifierType: '4',
  Remarks: 'Balance inquiry',
  QueueTimeOutURL: 'https://yourdomain.com/timeout',
  ResultURL: 'https://yourdomain.com/result',
});
```

### Transaction Status

Query transaction status:

```typescript
await mpesa.getTransactionStatus({
  InitiatorName: 'testapi',
  SecurityCredential: 'credential',
  CommandID: 'TransactionStatusQuery',
  TransactionID: 'OEI2AK4Q16',
  PartyA: '600000',
  IdentifierType: '4',
  ResultURL: 'https://yourdomain.com/result',
  QueueTimeOutURL: 'https://yourdomain.com/timeout',
  Remarks: 'Status query',
});
```

### Transaction Reversal

Reverse a transaction:

```typescript
await mpesa.reverseTransaction({
  InitiatorName: 'testapi',
  SecurityCredential: 'credential',
  CommandID: 'TransactionReversal',
  TransactionID: 'OEI2AK4Q16',
  Amount: 1000,
  ReceiverParty: '600000',
  RecieverIdentifierType: '4',
  ResultURL: 'https://yourdomain.com/result',
  QueueTimeOutURL: 'https://yourdomain.com/timeout',
  Remarks: 'Reversal',
});
```

## Callback Handling

Handle M-Pesa callbacks in your Express.js application:

```typescript
import express from 'express';

const app = express();
app.use(express.json());

// STK Push callback
app.post('/mpesa/stkpush/callback', (req, res) => {
  const callbackData = req.body;
  
  if (callbackData.Body?.stkCallback?.ResultCode === 0) {
    console.log('Payment successful!');
    // Update your database
  } else {
    console.log('Payment failed:', callbackData.Body.stkCallback.ResultDesc);
  }
  
  res.status(200).json({ status: 'OK' });
});

// B2C result callback
app.post('/mpesa/b2c/result', (req, res) => {
  const result = req.body.Result;
  
  if (result.ResultCode === 0) {
    console.log('B2C payment successful:', result.TransactionID);
  } else {
    console.log('B2C payment failed:', result.ResultDesc);
  }
  
  res.status(200).json({ status: 'OK' });
});
```

## Utilities

The library includes helpful utilities:

```typescript
import { MpesaUtils } from 'mpesalib';

// Format phone numbers
const formatted = MpesaUtils.formatPhoneNumber('0712345678');
// Returns: '254712345678'

// Generate timestamp
const timestamp = MpesaUtils.generateTimestamp();
// Returns: '20231201120000'

// Generate password for STK Push
const password = MpesaUtils.generatePassword(
  shortCode,
  passkey,
  timestamp
);

// Generate security credential
const credential = MpesaUtils.generateSecurityCredential(
  initiatorPassword,
  certificatePath
);

// Retry failed operations
const result = await MpesaUtils.retry(
  async () => mpesa.stkPush(request),
  3, // max retries
  1000 // delay in ms
);
```

## Error Handling

The library provides comprehensive error handling:

```typescript
try {
  const response = await mpesa.stkPush(request);
  console.log('Success:', response);
} catch (error) {
  if (error.status === 401) {
    console.error('Authentication failed');
  } else if (error.status === 400) {
    console.error('Bad request:', error.data);
  } else {
    console.error('Network error:', error.message);
  }
}
```

## Environment Configuration

### Required Environment Variables

```env
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_ENVIRONMENT=sandbox|production
MPESA_SHORT_CODE=your_shortcode
```

### Optional Environment Variables

```env
MPESA_INITIATOR_NAME=your_initiator_name
MPESA_SECURITY_CREDENTIAL=your_security_credential
MPESA_CERTIFICATE_PATH=./path/to/certificate.cer
MPESA_PASSKEY=your_passkey
```

## Getting Started with Daraja API

### 1. Create Daraja Account

1. Visit [Daraja Portal](https://developer.safaricom.co.ke/)
2. Create an account and verify your email
3. Login to the portal

### 2. Create an App

1. Go to "My Apps" section
2. Click "Add a new app"
3. Fill in app details:
   - **App Name**: Your application name
   - **Description**: Brief description of your app
   - **Select APIs**: Choose the APIs you need (STK Push, C2B, B2C, etc.)

### 3. Get Credentials

After creating the app, you'll get:
- **Consumer Key**: Used for authentication
- **Consumer Secret**: Used for authentication

### 4. Test Credentials (Sandbox)

For sandbox testing, use these test credentials:
- **Short Code**: 174379
- **Test MSISDN**: 254708374149
- **Passkey**: Get from Daraja portal

### 5. Production Setup

For production:
1. Request production access from Safaricom
2. Get production credentials
3. Update your configuration to use production environment

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure tests pass: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Submit a pull request

## Changelog

### v2.0.0 (Latest)

- ✨ Complete TypeScript rewrite
- ✨ Modern async/await API
- ✨ Comprehensive error handling
- ✨ Built-in retry mechanism
- ✨ Phone number formatting utilities
- ✨ 95%+ test coverage
- ✨ Updated Daraja API endpoints
- ✨ Environment variable support
- ✨ Callback handling utilities

### v0.0.2 (Legacy)

- Basic JavaScript implementation
- Limited error handling
- No TypeScript support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/matrixjnr/mpesa-node-api/wiki)
- 🐛 [Report Issues](https://github.com/matrixjnr/mpesa-node-api/issues)
- 💬 [Discussions](https://github.com/matrixjnr/mpesa-node-api/discussions)
- 📧 [Email Support](mailto:johnsimiyu4@gmail.com)

## Acknowledgments

- [Safaricom](https://www.safaricom.co.ke/) for providing the Daraja API
- [M-Pesa](https://www.vodafone.com/what-we-do/services/m-pesa) for the mobile payment platform
- All contributors who have helped improve this library

## Related Projects

- [M-Pesa Express](https://www.npmjs.com/package/mpesa-express) - Express.js middleware
- [M-Pesa Laravel](https://github.com/SmoDav/mpesa) - Laravel package
- [M-Pesa PHP](https://github.com/SmoDav/mpesa-php) - PHP SDK

---

Made with ❤️ by [John Simiyu](https://github.com/matrixjnr)
