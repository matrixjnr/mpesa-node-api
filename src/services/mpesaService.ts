import { HttpClient } from './httpClient';
import { MpesaUtils } from '../utils';
import {
  MpesaConfig,
  MpesaResponse,
  C2BRegisterUrlRequest,
  C2BSimulateRequest,
  B2CRequest,
  B2BRequest,
  STKPushRequest,
  STKPushQueryRequest,
  AccountBalanceRequest,
  TransactionStatusRequest,
  ReversalRequest,
} from '../types';

export class MpesaService {
  private httpClient: HttpClient;
  private config: MpesaConfig;

  constructor(config: MpesaConfig) {
    MpesaUtils.validateConfig(config);
    this.config = config;
    this.httpClient = new HttpClient(config);
  }

  /**
   * Register C2B URLs for confirmation and validation
   */
  async registerC2BUrls(request: C2BRegisterUrlRequest): Promise<MpesaResponse> {
    const endpoint = '/mpesa/c2b/v1/registerurl';
    return this.httpClient.post<MpesaResponse>(endpoint, request);
  }

  /**
   * Simulate a C2B transaction
   */
  async simulateC2B(request: C2BSimulateRequest): Promise<MpesaResponse> {
    const endpoint = '/mpesa/c2b/v1/simulate';
    
    // Format phone number
    const formattedRequest = {
      ...request,
      Msisdn: MpesaUtils.formatPhoneNumber(request.Msisdn),
    };

    return this.httpClient.post<MpesaResponse>(endpoint, formattedRequest);
  }

  /**
   * Business to Customer (B2C) payment
   */
  async b2cPayment(request: B2CRequest): Promise<MpesaResponse> {
    const endpoint = '/mpesa/b2c/v1/paymentrequest';
    
    // Format phone number
    const formattedRequest = {
      ...request,
      PartyB: MpesaUtils.formatPhoneNumber(request.PartyB),
    };

    return this.httpClient.post<MpesaResponse>(endpoint, formattedRequest);
  }

  /**
   * Business to Business (B2B) payment
   */
  async b2bPayment(request: B2BRequest): Promise<MpesaResponse> {
    const endpoint = '/mpesa/b2b/v1/paymentrequest';
    return this.httpClient.post<MpesaResponse>(endpoint, request);
  }

  /**
   * STK Push (Lipa Na M-Pesa Online)
   */
  async stkPush(request: Omit<STKPushRequest, 'Password' | 'Timestamp'>): Promise<MpesaResponse> {
    if (!this.config.passkey) {
      throw new Error('Passkey is required for STK Push requests');
    }

    const timestamp = MpesaUtils.generateTimestamp();
    const password = MpesaUtils.generatePassword(
      request.BusinessShortCode,
      this.config.passkey,
      timestamp
    );

    const fullRequest: STKPushRequest = {
      ...request,
      Password: password,
      Timestamp: timestamp,
      PhoneNumber: MpesaUtils.formatPhoneNumber(request.PhoneNumber),
      PartyA: MpesaUtils.formatPhoneNumber(request.PartyA),
    };

    const endpoint = '/mpesa/stkpush/v1/processrequest';
    return this.httpClient.post<MpesaResponse>(endpoint, fullRequest);
  }

  /**
   * STK Push Query (Check status of STK Push)
   */
  async stkPushQuery(checkoutRequestID: string): Promise<MpesaResponse> {
    if (!this.config.passkey || !this.config.shortCode) {
      throw new Error('Passkey and shortCode are required for STK Push query');
    }

    const timestamp = MpesaUtils.generateTimestamp();
    const password = MpesaUtils.generatePassword(
      this.config.shortCode,
      this.config.passkey,
      timestamp
    );

    const request: STKPushQueryRequest = {
      BusinessShortCode: this.config.shortCode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID,
    };

    const endpoint = '/mpesa/stkpushquery/v1/query';
    return this.httpClient.post<MpesaResponse>(endpoint, request);
  }

  /**
   * Check account balance
   */
  async getAccountBalance(request: AccountBalanceRequest): Promise<MpesaResponse> {
    const endpoint = '/mpesa/accountbalance/v1/query';
    return this.httpClient.post<MpesaResponse>(endpoint, request);
  }

  /**
   * Query transaction status
   */
  async getTransactionStatus(request: TransactionStatusRequest): Promise<MpesaResponse> {
    const endpoint = '/mpesa/transactionstatus/v1/query';
    return this.httpClient.post<MpesaResponse>(endpoint, request);
  }

  /**
   * Reverse a transaction
   */
  async reverseTransaction(request: ReversalRequest): Promise<MpesaResponse> {
    const endpoint = '/mpesa/reversal/v1/request';
    return this.httpClient.post<MpesaResponse>(endpoint, request);
  }

  /**
   * Generate security credential for API requests
   */
  generateSecurityCredential(initiatorPassword: string): string {
    if (!this.config.certificatePath) {
      throw new Error('Certificate path is required to generate security credential');
    }
    return MpesaUtils.generateSecurityCredential(initiatorPassword, this.config.certificatePath);
  }

  /**
   * Convenience method for salary payment (B2C)
   */
  async salaryPayment(
    amount: number,
    phoneNumber: string,
    remarks: string,
    queueTimeOutURL: string,
    resultURL: string,
    occasion?: string
  ): Promise<MpesaResponse> {
    if (!this.config.initiatorName || !this.config.securityCredential) {
      throw new Error('InitiatorName and SecurityCredential are required for salary payments');
    }

    const request: B2CRequest = {
      InitiatorName: this.config.initiatorName,
      SecurityCredential: this.config.securityCredential,
      CommandID: 'SalaryPayment',
      Amount: amount,
      PartyA: this.config.shortCode,
      PartyB: phoneNumber,
      Remarks: remarks,
      QueueTimeOutURL: queueTimeOutURL,
      ResultURL: resultURL,
      Occasion: occasion,
    };

    return this.b2cPayment(request);
  }

  /**
   * Convenience method for business payment (B2C)
   */
  async businessPayment(
    amount: number,
    phoneNumber: string,
    remarks: string,
    queueTimeOutURL: string,
    resultURL: string,
    occasion?: string
  ): Promise<MpesaResponse> {
    if (!this.config.initiatorName || !this.config.securityCredential) {
      throw new Error('InitiatorName and SecurityCredential are required for business payments');
    }

    const request: B2CRequest = {
      InitiatorName: this.config.initiatorName,
      SecurityCredential: this.config.securityCredential,
      CommandID: 'BusinessPayment',
      Amount: amount,
      PartyA: this.config.shortCode,
      PartyB: phoneNumber,
      Remarks: remarks,
      QueueTimeOutURL: queueTimeOutURL,
      ResultURL: resultURL,
      Occasion: occasion,
    };

    return this.b2cPayment(request);
  }

  /**
   * Convenience method for paybill payment (STK Push)
   */
  async paybillPayment(
    amount: number,
    phoneNumber: string,
    accountReference: string,
    transactionDesc: string,
    callBackURL: string
  ): Promise<MpesaResponse> {
    const request = {
      BusinessShortCode: this.config.shortCode,
      TransactionType: 'CustomerPayBillOnline' as const,
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: this.config.shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: callBackURL,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    };

    return this.stkPush(request);
  }

  /**
   * Convenience method for buy goods payment (STK Push)
   */
  async buyGoodsPayment(
    amount: number,
    phoneNumber: string,
    accountReference: string,
    transactionDesc: string,
    callBackURL: string
  ): Promise<MpesaResponse> {
    const request = {
      BusinessShortCode: this.config.shortCode,
      TransactionType: 'CustomerBuyGoodsOnline' as const,
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: this.config.shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: callBackURL,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    };

    return this.stkPush(request);
  }

  /**
   * Get configuration (useful for debugging)
   */
  getConfig(): Partial<MpesaConfig> {
    // Return config without sensitive data
    return {
      environment: this.config.environment,
      shortCode: this.config.shortCode,
      initiatorName: this.config.initiatorName,
    };
  }
}
