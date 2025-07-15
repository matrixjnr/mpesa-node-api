// Local development import (while working with source code)
// For development/local testing, use relative import:
import { Mpesa, MpesaConfig } from '../src';

// For published package, use:
// import { Mpesa, MpesaConfig } from 'mpesalib';

// Production import (after installing from npm):
// import { Mpesa, MpesaConfig } from 'mpesa-daraja-api';

// Example 1: Basic configuration
const config: MpesaConfig = {
  consumerKey: 'your_consumer_key',
  consumerSecret: 'your_consumer_secret',
  environment: 'sandbox', // or 'production'
  shortCode: '174379',
  initiatorName: 'testapi',
  securityCredential: 'your_security_credential',
  passkey: 'your_passkey',
};

const mpesa = new Mpesa(config);

// Example 2: Using environment variables
const mpesaFromEnv = Mpesa.fromEnv();

// Example 3: STK Push (Lipa Na M-Pesa Online)
async function stkPushExample() {
  try {
    const response = await mpesa.paybillPayment(
      1000, // Amount
      '254712345678', // Phone number
      'INV001', // Account reference
      'Payment for invoice INV001', // Description
      'https://yourdomain.com/callback' // Callback URL
    );
    
    console.log('STK Push initiated:', response);
    
    // Query STK Push status
    if (response.CheckoutRequestID) {
      const statusResponse = await mpesa.stkPushQuery(response.CheckoutRequestID);
      console.log('STK Push status:', statusResponse);
    }
  } catch (error) {
    console.error('STK Push failed:', error);
  }
}

// Example 4: B2C Payment (Business to Customer)
async function b2cPaymentExample() {
  try {
    const response = await mpesa.businessPayment(
      5000, // Amount
      '254712345678', // Recipient phone number
      'Business payment', // Remarks
      'https://yourdomain.com/timeout', // Timeout URL
      'https://yourdomain.com/result', // Result URL
      'Monthly payment' // Occasion (optional)
    );
    
    console.log('B2C Payment initiated:', response);
  } catch (error) {
    console.error('B2C Payment failed:', error);
  }
}

// Example 5: C2B Registration
async function c2bRegistrationExample() {
  try {
    const response = await mpesa.registerC2BUrls({
      ShortCode: '600000',
      ResponseType: 'Completed',
      ConfirmationURL: 'https://yourdomain.com/c2b/confirmation',
      ValidationURL: 'https://yourdomain.com/c2b/validation',
    });
    
    console.log('C2B URLs registered:', response);
  } catch (error) {
    console.error('C2B registration failed:', error);
  }
}

// Example 6: C2B Simulation
async function c2bSimulationExample() {
  try {
    const response = await mpesa.simulateC2B({
      ShortCode: '600000',
      CommandID: 'CustomerPayBillOnline',
      Amount: 1000,
      Msisdn: '254712345678',
      BillRefNumber: 'INV001',
    });
    
    console.log('C2B simulation result:', response);
  } catch (error) {
    console.error('C2B simulation failed:', error);
  }
}

// Example 7: Account Balance
async function accountBalanceExample() {
  try {
    const response = await mpesa.getAccountBalance({
      InitiatorName: 'testapi',
      SecurityCredential: 'your_security_credential',
      CommandID: 'AccountBalance',
      PartyA: '600000',
      IdentifierType: '4',
      Remarks: 'Balance inquiry',
      QueueTimeOutURL: 'https://yourdomain.com/timeout',
      ResultURL: 'https://yourdomain.com/result',
    });
    
    console.log('Account balance request:', response);
  } catch (error) {
    console.error('Account balance inquiry failed:', error);
  }
}

// Example 8: Transaction Status Query
async function transactionStatusExample() {
  try {
    const response = await mpesa.getTransactionStatus({
      InitiatorName: 'testapi',
      SecurityCredential: 'your_security_credential',
      CommandID: 'TransactionStatusQuery',
      TransactionID: 'OEI2AK4Q16', // Transaction ID to query
      PartyA: '600000',
      IdentifierType: '4',
      ResultURL: 'https://yourdomain.com/result',
      QueueTimeOutURL: 'https://yourdomain.com/timeout',
      Remarks: 'Status query',
      Occasion: 'Transaction inquiry',
    });
    
    console.log('Transaction status:', response);
  } catch (error) {
    console.error('Transaction status query failed:', error);
  }
}

// Example 9: Transaction Reversal
async function transactionReversalExample() {
  try {
    const response = await mpesa.reverseTransaction({
      InitiatorName: 'testapi',
      SecurityCredential: 'your_security_credential',
      CommandID: 'TransactionReversal',
      TransactionID: 'OEI2AK4Q16', // Transaction ID to reverse
      Amount: 1000,
      ReceiverParty: '600000',
      RecieverIdentifierType: '4',
      ResultURL: 'https://yourdomain.com/result',
      QueueTimeOutURL: 'https://yourdomain.com/timeout',
      Remarks: 'Transaction reversal',
      Occasion: 'Error correction',
    });
    
    console.log('Transaction reversal:', response);
  } catch (error) {
    console.error('Transaction reversal failed:', error);
  }
}

// Example 10: Handling callbacks
import express from 'express';

const app = express();
app.use(express.json());

// STK Push callback handler
app.post('/mpesa/stkpush/callback', (req, res) => {
  const callbackData = req.body;
  
  console.log('STK Push callback received:', callbackData);
  
  // Process the callback
  if (callbackData.Body?.stkCallback) {
    const callback = callbackData.Body.stkCallback;
    
    if (callback.ResultCode === 0) {
      console.log('Payment successful:', callback.CheckoutRequestID);
      // Update your database, send confirmation, etc.
    } else {
      console.log('Payment failed:', callback.ResultDesc);
      // Handle failed payment
    }
  }
  
  // Always respond with 200 OK
  res.status(200).json({ status: 'OK' });
});

// B2C result callback handler
app.post('/mpesa/b2c/result', (req, res) => {
  const resultData = req.body;
  
  console.log('B2C result received:', resultData);
  
  // Process the result
  if (resultData.Result) {
    const result = resultData.Result;
    
    if (result.ResultCode === 0) {
      console.log('B2C payment successful:', result.TransactionID);
    } else {
      console.log('B2C payment failed:', result.ResultDesc);
    }
  }
  
  res.status(200).json({ status: 'OK' });
});

// Run examples
async function runExamples() {
  console.log('Running M-Pesa API examples...');
  
  await stkPushExample();
  await c2bRegistrationExample();
  await accountBalanceExample();
  
  console.log('Examples completed!');
}

// Uncomment to run examples
// runExamples().catch(console.error);

export {
  stkPushExample,
  b2cPaymentExample,
  c2bRegistrationExample,
  c2bSimulationExample,
  accountBalanceExample,
  transactionStatusExample,
  transactionReversalExample,
};
