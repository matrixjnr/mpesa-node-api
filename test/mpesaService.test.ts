import { MpesaService } from '../src/services/mpesaService';
import { HttpClient } from '../src/services/httpClient';
import { MpesaConfig } from '../src/types';

// Mock the HttpClient
jest.mock('../src/services/httpClient');

describe('MpesaService', () => {
  let mpesaService: MpesaService;
  let mockHttpClient: jest.Mocked<HttpClient>;

  const mockConfig: MpesaConfig = {
    consumerKey: 'test_consumer_key',
    consumerSecret: 'test_consumer_secret',
    environment: 'sandbox',
    shortCode: '174379',
    initiatorName: 'testapi',
    securityCredential: 'test_credential',
    passkey: 'test_passkey',
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    mpesaService = new MpesaService(mockConfig);
    mockHttpClient = (mpesaService as any).httpClient;
  });

  describe('constructor', () => {
    it('should create instance with valid config', () => {
      expect(mpesaService).toBeInstanceOf(MpesaService);
    });

    it('should throw error for invalid config', () => {
      const invalidConfig = { ...mockConfig, consumerKey: '' };
      expect(() => new MpesaService(invalidConfig)).toThrow();
    });
  });

  describe('registerC2BUrls', () => {
    it('should register C2B URLs successfully', async () => {
      const request = {
        ShortCode: '600000',
        ResponseType: 'Completed' as const,
        ConfirmationURL: 'https://example.com/confirmation',
        ValidationURL: 'https://example.com/validation',
      };

      const mockResponse = {
        ResponseCode: '0',
        ResponseDescription: 'Success',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await mpesaService.registerC2BUrls(request);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/mpesa/c2b/v1/registerurl', request);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('simulateC2B', () => {
    it('should simulate C2B transaction with formatted phone number', async () => {
      const request = {
        ShortCode: '600000',
        CommandID: 'CustomerPayBillOnline' as const,
        Amount: 1000,
        Msisdn: '0712345678',
        BillRefNumber: 'TEST123',
      };

      const mockResponse = {
        ResponseCode: '0',
        ResponseDescription: 'Success',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await mpesaService.simulateC2B(request);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/mpesa/c2b/v1/simulate', {
        ...request,
        Msisdn: '254712345678', // Should be formatted
      });
    });
  });

  describe('stkPush', () => {
    it('should initiate STK push with generated password and timestamp', async () => {
      const request = {
        BusinessShortCode: '174379',
        TransactionType: 'CustomerPayBillOnline' as const,
        Amount: 1000,
        PartyA: '254712345678',
        PartyB: '174379',
        PhoneNumber: '0712345678',
        CallBackURL: 'https://example.com/callback',
        AccountReference: 'TEST123',
        TransactionDesc: 'Test payment',
      };

      const mockResponse = {
        MerchantRequestID: 'test_merchant_id',
        CheckoutRequestID: 'test_checkout_id',
        ResponseCode: '0',
        ResponseDescription: 'Success',
        CustomerMessage: 'Success',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await mpesaService.stkPush(request);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/mpesa/stkpush/v1/processrequest',
        expect.objectContaining({
          ...request,
          PhoneNumber: '254712345678',
          PartyA: '254712345678',
          Password: expect.any(String),
          Timestamp: expect.stringMatching(/^\d{14}$/),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error if passkey is not configured', async () => {
      const serviceWithoutPasskey = new MpesaService({
        ...mockConfig,
        passkey: undefined,
      });

      const request = {
        BusinessShortCode: '174379',
        TransactionType: 'CustomerPayBillOnline' as const,
        Amount: 1000,
        PartyA: '254712345678',
        PartyB: '174379',
        PhoneNumber: '254712345678',
        CallBackURL: 'https://example.com/callback',
        AccountReference: 'TEST123',
        TransactionDesc: 'Test payment',
      };

      await expect(serviceWithoutPasskey.stkPush(request)).rejects.toThrow(
        'Passkey is required for STK Push requests'
      );
    });
  });

  describe('stkPushQuery', () => {
    it('should query STK push status', async () => {
      const checkoutRequestID = 'ws_CO_test123';
      const mockResponse = {
        ResponseCode: '0',
        ResponseDescription: 'Success',
        MerchantRequestID: 'test_merchant_id',
        CheckoutRequestID: checkoutRequestID,
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await mpesaService.stkPushQuery(checkoutRequestID);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/mpesa/stkpushquery/v1/query',
        expect.objectContaining({
          BusinessShortCode: mockConfig.shortCode,
          CheckoutRequestID: checkoutRequestID,
          Password: expect.any(String),
          Timestamp: expect.stringMatching(/^\d{14}$/),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('b2cPayment', () => {
    it('should process B2C payment with formatted phone number', async () => {
      const request = {
        InitiatorName: 'testapi',
        SecurityCredential: 'test_credential',
        CommandID: 'BusinessPayment' as const,
        Amount: 1000,
        PartyA: '174379',
        PartyB: '0712345678',
        Remarks: 'Test payment',
        QueueTimeOutURL: 'https://example.com/timeout',
        ResultURL: 'https://example.com/result',
        Occasion: 'Test',
      };

      const mockResponse = {
        ConversationID: 'AG_test123',
        OriginatorConversationID: 'test_originator',
        ResponseCode: '0',
        ResponseDescription: 'Success',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      await mpesaService.b2cPayment(request);

      expect(mockHttpClient.post).toHaveBeenCalledWith('/mpesa/b2c/v1/paymentrequest', {
        ...request,
        PartyB: '254712345678', // Should be formatted
      });
    });
  });

  describe('salaryPayment', () => {
    it('should process salary payment using configured credentials', async () => {
      const mockResponse = {
        ConversationID: 'AG_test123',
        OriginatorConversationID: 'test_originator',
        ResponseCode: '0',
        ResponseDescription: 'Success',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await mpesaService.salaryPayment(
        5000,
        '254712345678',
        'Salary payment',
        'https://example.com/timeout',
        'https://example.com/result',
        'Monthly salary'
      );

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/mpesa/b2c/v1/paymentrequest',
        expect.objectContaining({
          InitiatorName: mockConfig.initiatorName,
          SecurityCredential: mockConfig.securityCredential,
          CommandID: 'SalaryPayment',
          Amount: 5000,
          PartyA: mockConfig.shortCode,
          PartyB: '254712345678',
          Remarks: 'Salary payment',
          Occasion: 'Monthly salary',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error if initiator credentials are not configured', async () => {
      const serviceWithoutCredentials = new MpesaService({
        ...mockConfig,
        initiatorName: undefined,
        securityCredential: undefined,
      });

      await expect(
        serviceWithoutCredentials.salaryPayment(
          5000,
          '254712345678',
          'Salary payment',
          'https://example.com/timeout',
          'https://example.com/result'
        )
      ).rejects.toThrow('InitiatorName and SecurityCredential are required');
    });
  });

  describe('paybillPayment', () => {
    it('should process paybill payment using STK push', async () => {
      const mockResponse = {
        MerchantRequestID: 'test_merchant_id',
        CheckoutRequestID: 'test_checkout_id',
        ResponseCode: '0',
        ResponseDescription: 'Success',
        CustomerMessage: 'Success',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await mpesaService.paybillPayment(
        1000,
        '254712345678',
        'TEST123',
        'Test payment',
        'https://example.com/callback'
      );

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/mpesa/stkpush/v1/processrequest',
        expect.objectContaining({
          BusinessShortCode: mockConfig.shortCode,
          TransactionType: 'CustomerPayBillOnline',
          Amount: 1000,
          PartyA: '254712345678',
          PartyB: mockConfig.shortCode,
          PhoneNumber: '254712345678',
          CallBackURL: 'https://example.com/callback',
          AccountReference: 'TEST123',
          TransactionDesc: 'Test payment',
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getConfig', () => {
    it('should return non-sensitive config data', () => {
      const config = mpesaService.getConfig();
      
      expect(config).toEqual({
        environment: mockConfig.environment,
        shortCode: mockConfig.shortCode,
        initiatorName: mockConfig.initiatorName,
      });
      
      // Ensure sensitive data is not included
      expect(config).not.toHaveProperty('consumerKey');
      expect(config).not.toHaveProperty('consumerSecret');
      expect(config).not.toHaveProperty('securityCredential');
    });
  });
});
