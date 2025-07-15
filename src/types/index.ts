/* eslint-disable no-unused-vars */
export interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  environment: 'sandbox' | 'production';
  shortCode: string;
  initiatorName?: string;
  securityCredential?: string;
  certificatePath?: string;
  passkey?: string;
}

export interface AuthResponse {
  access_token: string;
  expires_in: string;
}

export interface MpesaResponse {
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage?: string;
  ConversationID?: string;
  OriginatorConversationID?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface C2BRegisterUrlRequest {
  ShortCode: string;
  ResponseType: 'Completed' | 'Cancelled';
  ConfirmationURL: string;
  ValidationURL: string;
}

export interface C2BSimulateRequest {
  ShortCode: string;
  CommandID: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
  Amount: number;
  Msisdn: string;
  BillRefNumber?: string;
}

export interface B2CRequest {
  InitiatorName: string;
  SecurityCredential: string;
  CommandID: 'SalaryPayment' | 'BusinessPayment' | 'PromotionPayment';
  Amount: number;
  PartyA: string;
  PartyB: string;
  Remarks: string;
  QueueTimeOutURL: string;
  ResultURL: string;
  Occasion?: string;
}

export interface B2BRequest {
  InitiatorName: string;
  SecurityCredential: string;
  CommandID: 'BusinessPayBill' | 'MerchantToMerchantTransfer' | 'MerchantTransferFromMerchantToWorking' | 'MerchantServicesMMFAccountTransfer' | 'AgencyFloatAdvance';
  Amount: number;
  PartyA: string;
  PartyB: string;
  RecieverIdentifierType: number;
  Remarks: string;
  QueueTimeOutURL: string;
  ResultURL: string;
  AccountReference: string;
}

export interface STKPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

export interface STKPushQueryRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  CheckoutRequestID: string;
}

export interface AccountBalanceRequest {
  InitiatorName: string;
  SecurityCredential: string;
  CommandID: 'AccountBalance';
  PartyA: string;
  IdentifierType: '1' | '2' | '4';
  Remarks: string;
  QueueTimeOutURL: string;
  ResultURL: string;
}

export interface TransactionStatusRequest {
  InitiatorName: string;
  SecurityCredential: string;
  CommandID: 'TransactionStatusQuery';
  TransactionID: string;
  PartyA: string;
  IdentifierType: '1' | '2' | '4';
  ResultURL: string;
  QueueTimeOutURL: string;
  Remarks: string;
  Occasion?: string;
}

export interface ReversalRequest {
  InitiatorName: string;
  SecurityCredential: string;
  CommandID: 'TransactionReversal';
  TransactionID: string;
  Amount: number;
  ReceiverParty: string;
  RecieverIdentifierType: '1' | '2' | '4';
  ResultURL: string;
  QueueTimeOutURL: string;
  Remarks: string;
  Occasion?: string;
}

export interface CallbackData {
  Body: {
    stkCallback?: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
    Result?: {
      ResultType: number;
      ResultCode: number;
      ResultDesc: string;
      OriginatorConversationID: string;
      ConversationID: string;
      TransactionID: string;
      ResultParameters?: {
        ResultParameter: Array<{
          Key: string;
          Value: string | number;
        }>;
      };
      ReferenceData?: {
        ReferenceItem: {
          Key: string;
          Value: string;
        };
      };
    };
  };
}

// eslint-disable-next-line no-unused-vars
export enum Environment {
  SANDBOX = 'sandbox',
  PRODUCTION = 'production'
}

// eslint-disable-next-line no-unused-vars
export enum TransactionType {
  CUSTOMER_PAYBILL_ONLINE = 'CustomerPayBillOnline',
  CUSTOMER_BUY_GOODS_ONLINE = 'CustomerBuyGoodsOnline'
}

// eslint-disable-next-line no-unused-vars
export enum CommandID {
  SALARY_PAYMENT = 'SalaryPayment',
  BUSINESS_PAYMENT = 'BusinessPayment',
  PROMOTION_PAYMENT = 'PromotionPayment',
  ACCOUNT_BALANCE = 'AccountBalance',
  TRANSACTION_REVERSAL = 'TransactionReversal',
  TRANSACTION_STATUS_QUERY = 'TransactionStatusQuery',
  BUSINESS_PAYBILL = 'BusinessPayBill',
  MERCHANT_TO_MERCHANT_TRANSFER = 'MerchantToMerchantTransfer'
}
