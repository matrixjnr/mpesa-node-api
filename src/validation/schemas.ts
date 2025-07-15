import Joi from 'joi';

export const configSchema = Joi.object({
  consumerKey: Joi.string().required(),
  consumerSecret: Joi.string().required(),
  environment: Joi.string().valid('sandbox', 'production').required(),
  shortCode: Joi.string().required(),
  initiatorName: Joi.string().optional(),
  securityCredential: Joi.string().optional(),
  certificatePath: Joi.string().optional(),
  passkey: Joi.string().optional(),
});

export const c2bRegisterUrlSchema = Joi.object({
  ShortCode: Joi.string().required(),
  ResponseType: Joi.string().valid('Completed', 'Cancelled').required(),
  ConfirmationURL: Joi.string().uri().required(),
  ValidationURL: Joi.string().uri().required(),
});

export const c2bSimulateSchema = Joi.object({
  ShortCode: Joi.string().required(),
  CommandID: Joi.string().valid('CustomerPayBillOnline', 'CustomerBuyGoodsOnline').required(),
  Amount: Joi.number().positive().required(),
  Msisdn: Joi.string().pattern(/^254[0-9]{9}$/).required(),
  BillRefNumber: Joi.string().optional(),
});

export const b2cSchema = Joi.object({
  InitiatorName: Joi.string().required(),
  SecurityCredential: Joi.string().required(),
  CommandID: Joi.string().valid('SalaryPayment', 'BusinessPayment', 'PromotionPayment').required(),
  Amount: Joi.number().positive().required(),
  PartyA: Joi.string().required(),
  PartyB: Joi.string().pattern(/^254[0-9]{9}$/).required(),
  Remarks: Joi.string().max(100).required(),
  QueueTimeOutURL: Joi.string().uri().required(),
  ResultURL: Joi.string().uri().required(),
  Occasion: Joi.string().max(100).optional(),
});

export const b2bSchema = Joi.object({
  InitiatorName: Joi.string().required(),
  SecurityCredential: Joi.string().required(),
  CommandID: Joi.string().valid(
    'BusinessPayBill',
    'MerchantToMerchantTransfer',
    'MerchantTransferFromMerchantToWorking',
    'MerchantServicesMMFAccountTransfer',
    'AgencyFloatAdvance'
  ).required(),
  Amount: Joi.number().positive().required(),
  PartyA: Joi.string().required(),
  PartyB: Joi.string().required(),
  RecieverIdentifierType: Joi.number().valid(1, 2, 4).required(),
  Remarks: Joi.string().max(100).required(),
  QueueTimeOutURL: Joi.string().uri().required(),
  ResultURL: Joi.string().uri().required(),
  AccountReference: Joi.string().max(100).required(),
});

export const stkPushSchema = Joi.object({
  BusinessShortCode: Joi.string().required(),
  Password: Joi.string().required(),
  Timestamp: Joi.string().length(14).required(),
  TransactionType: Joi.string().valid('CustomerPayBillOnline', 'CustomerBuyGoodsOnline').required(),
  Amount: Joi.number().positive().required(),
  PartyA: Joi.string().pattern(/^254[0-9]{9}$/).required(),
  PartyB: Joi.string().required(),
  PhoneNumber: Joi.string().pattern(/^254[0-9]{9}$/).required(),
  CallBackURL: Joi.string().uri().required(),
  AccountReference: Joi.string().max(100).required(),
  TransactionDesc: Joi.string().max(100).required(),
});

export const stkPushQuerySchema = Joi.object({
  BusinessShortCode: Joi.string().required(),
  Password: Joi.string().required(),
  Timestamp: Joi.string().length(14).required(),
  CheckoutRequestID: Joi.string().required(),
});

export const accountBalanceSchema = Joi.object({
  InitiatorName: Joi.string().required(),
  SecurityCredential: Joi.string().required(),
  CommandID: Joi.string().valid('AccountBalance').required(),
  PartyA: Joi.string().required(),
  IdentifierType: Joi.string().valid('1', '2', '4').required(),
  Remarks: Joi.string().max(100).required(),
  QueueTimeOutURL: Joi.string().uri().required(),
  ResultURL: Joi.string().uri().required(),
});

export const transactionStatusSchema = Joi.object({
  InitiatorName: Joi.string().required(),
  SecurityCredential: Joi.string().required(),
  CommandID: Joi.string().valid('TransactionStatusQuery').required(),
  TransactionID: Joi.string().required(),
  PartyA: Joi.string().required(),
  IdentifierType: Joi.string().valid('1', '2', '4').required(),
  ResultURL: Joi.string().uri().required(),
  QueueTimeOutURL: Joi.string().uri().required(),
  Remarks: Joi.string().max(100).required(),
  Occasion: Joi.string().max(100).optional(),
});

export const reversalSchema = Joi.object({
  InitiatorName: Joi.string().required(),
  SecurityCredential: Joi.string().required(),
  CommandID: Joi.string().valid('TransactionReversal').required(),
  TransactionID: Joi.string().required(),
  Amount: Joi.number().positive().required(),
  ReceiverParty: Joi.string().required(),
  RecieverIdentifierType: Joi.string().valid('1', '2', '4').required(),
  ResultURL: Joi.string().uri().required(),
  QueueTimeOutURL: Joi.string().uri().required(),
  Remarks: Joi.string().max(100).required(),
  Occasion: Joi.string().max(100).optional(),
});
