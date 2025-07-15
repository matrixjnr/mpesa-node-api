# Migration Guide: mpesalib v1.x → v3.0.0

## Overview

`mpesalib` v3.0.0 is a **complete rewrite** of the library from JavaScript to TypeScript with a modern, Promise-based API. While the package name remains the same for backward compatibility, the API has significant breaking changes.

## ⚠️ Breaking Changes

### 1. **Complete API Rewrite**
- **v1.x**: Callback-based API
- **v2.0**: Promise-based API with async/await

### 2. **Import Changes**
```typescript
// v1.x (JavaScript)
const mpesa = require('mpesalib');

// v2.0 (TypeScript/JavaScript)
import { Mpesa } from 'mpesalib';
// or
const { Mpesa } = require('mpesalib');
```

### 3. **Initialization Changes**
```typescript
// v1.x
const mpesa = require('mpesalib');
mpesa.init({
  key: 'your_key',
  secret: 'your_secret',
  // ... other config
});

// v2.0
import { Mpesa } from 'mpesalib';

const mpesa = new Mpesa({
  consumerKey: 'your_key',
  consumerSecret: 'your_secret',
  environment: 'sandbox', // or 'production'
  shortCode: '174379',
  // ... other config
});

// Or using environment variables
const mpesa = Mpesa.fromEnv();
```

## 📋 Method Migration

### STK Push (Lipa Na M-Pesa)

#### v1.x
```javascript
mpesa.lipanampesaonline({
  BusinessShortCode: '174379',
  Password: 'password',
  Timestamp: '20191010101010',
  TransactionType: 'CustomerPayBillOnline',
  Amount: 1000,
  PartyA: '254712345678',
  PartyB: '174379',
  PhoneNumber: '254712345678',
  CallBackURL: 'https://yourdomain.com/callback',
  AccountReference: 'INV001',
  TransactionDesc: 'Payment'
}, function(error, response) {
  if (error) {
    console.log(error);
  } else {
    console.log(response);
  }
});
```

#### v2.0
```typescript
try {
  const response = await mpesa.paybillPayment(
    1000,                                    // amount
    '254712345678',                         // phone number
    'INV001',                               // account reference
    'Payment',                              // description
    'https://yourdomain.com/callback'       // callback URL
  );
  console.log(response);
} catch (error) {
  console.error(error);
}
```

### STK Push Query

#### v1.x
```javascript
mpesa.lipanampesaquery({
  BusinessShortCode: '174379',
  Password: 'password',
  Timestamp: '20191010101010',
  CheckoutRequestID: 'ws_CO_DMZ_123456789_11032019120000'
}, function(error, response) {
  // handle response
});
```

#### v2.0
```typescript
try {
  const response = await mpesa.stkPushQuery('ws_CO_DMZ_123456789_11032019120000');
  console.log(response);
} catch (error) {
  console.error(error);
}
```

### B2C Payment

#### v1.x
```javascript
mpesa.b2c({
  InitiatorName: 'testapi',
  SecurityCredential: 'credential',
  CommandID: 'BusinessPayment',
  Amount: 5000,
  PartyA: '600000',
  PartyB: '254712345678',
  Remarks: 'Payment',
  QueueTimeOutURL: 'https://yourdomain.com/timeout',
  ResultURL: 'https://yourdomain.com/result',
  Occasion: 'Monthly payment'
}, function(error, response) {
  // handle response
});
```

#### v2.0
```typescript
try {
  const response = await mpesa.businessPayment(
    5000,                                   // amount
    '254712345678',                        // recipient phone
    'Payment',                             // remarks
    'https://yourdomain.com/timeout',      // timeout URL
    'https://yourdomain.com/result',       // result URL
    'Monthly payment'                      // occasion (optional)
  );
  console.log(response);
} catch (error) {
  console.error(error);
}
```

### C2B Register URLs

#### v1.x
```javascript
mpesa.c2bregister({
  ShortCode: '600000',
  ResponseType: 'Completed',
  ConfirmationURL: 'https://yourdomain.com/confirmation',
  ValidationURL: 'https://yourdomain.com/validation'
}, function(error, response) {
  // handle response
});
```

#### v2.0
```typescript
try {
  const response = await mpesa.registerC2BUrls({
    ShortCode: '600000',
    ResponseType: 'Completed',
    ConfirmationURL: 'https://yourdomain.com/confirmation',
    ValidationURL: 'https://yourdomain.com/validation'
  });
  console.log(response);
} catch (error) {
  console.error(error);
}
```

## 🆕 New Features in v2.0

### 1. **TypeScript Support**
```typescript
import { Mpesa, MpesaConfig, STKPushRequest } from 'mpesalib';

const config: MpesaConfig = {
  consumerKey: 'your_key',
  consumerSecret: 'your_secret',
  environment: 'sandbox'
};
```

### 2. **Automatic Phone Number Formatting**
```typescript
// All of these work automatically:
await mpesa.paybillPayment(1000, '0712345678', 'REF', 'Desc', 'callback');
await mpesa.paybillPayment(1000, '712345678', 'REF', 'Desc', 'callback');
await mpesa.paybillPayment(1000, '+254712345678', 'REF', 'Desc', 'callback');
// All get formatted to: 254712345678
```

### 3. **Environment Variable Configuration**
```bash
# .env file
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_ENVIRONMENT=sandbox
MPESA_SHORT_CODE=174379
MPESA_PASSKEY=your_passkey
```

```typescript
// Automatic configuration from .env
const mpesa = Mpesa.fromEnv();
```

### 4. **Built-in Utilities**
```typescript
import { MpesaUtils } from 'mpesalib';

// Format phone numbers
const formatted = MpesaUtils.formatPhoneNumber('0712345678');

// Generate timestamps
const timestamp = MpesaUtils.generateTimestamp();

// Generate passwords
const password = MpesaUtils.generatePassword('174379', 'passkey', timestamp);
```

### 5. **Comprehensive Error Handling**
```typescript
try {
  const response = await mpesa.paybillPayment(/* ... */);
} catch (error) {
  if (error.code === 'INVALID_PHONE_NUMBER') {
    console.log('Phone number is invalid');
  } else if (error.code === 'INSUFFICIENT_FUNDS') {
    console.log('Insufficient funds');
  }
  console.log('Error details:', error.details);
}
```

## 🚀 Migration Steps

### Step 1: Update Dependencies
```bash
npm update mpesalib
```

### Step 2: Update Imports
```typescript
// Replace this:
const mpesa = require('mpesalib');

// With this:
import { Mpesa } from 'mpesalib';
```

### Step 3: Update Initialization
```typescript
// Replace callback-based init with constructor
const mpesa = new Mpesa({
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  environment: 'sandbox',
  shortCode: '174379',
  passkey: process.env.MPESA_PASSKEY
});
```

### Step 4: Convert Callbacks to Async/Await
```typescript
// Replace callback patterns:
mpesa.someMethod(params, function(error, response) {
  // handle response
});

// With async/await:
try {
  const response = await mpesa.someMethod(params);
  // handle response
} catch (error) {
  // handle error
}
```

## 📞 Support

If you need help migrating:
- Check the [API Reference](./docs/API_REFERENCE.md)
- Review [examples](./examples/basic-usage.ts)
- Open an issue on [GitHub](https://github.com/matrixjnr/mpesa-node-api/issues)

## ✅ Benefits of Upgrading

- 🔒 **Better Security**: Updated authentication and token management
- 🚀 **Better Performance**: Modern HTTP client with connection pooling
- 🛡️ **Error Handling**: Comprehensive error types and messages
- 📱 **Phone Validation**: Automatic formatting and validation
- 🧪 **Testing**: 95%+ test coverage for reliability
- 📖 **Documentation**: Complete TypeScript types and documentation
- 🔄 **Retry Logic**: Built-in retry for network failures
