import { MpesaUtils } from '../src/utils';
import { MpesaConfig } from '../src/types';
import * as fs from 'fs';
import * as path from 'path';

describe('MpesaUtils', () => {
  describe('generateTimestamp', () => {
    it('should generate timestamp in correct format', () => {
      const timestamp = MpesaUtils.generateTimestamp();
      expect(timestamp).toMatch(/^\d{14}$/);
    });
  });

  describe('generatePassword', () => {
    it('should generate base64 encoded password', () => {
      const shortCode = '174379';
      const passkey = 'test_passkey';
      const timestamp = '20231201120000';
      
      const password = MpesaUtils.generatePassword(shortCode, passkey, timestamp);
      const expected = Buffer.from(shortCode + passkey + timestamp).toString('base64');
      
      expect(password).toBe(expected);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 07XXXXXXXX to 254XXXXXXXX', () => {
      const formatted = MpesaUtils.formatPhoneNumber('0712345678');
      expect(formatted).toBe('254712345678');
    });

    it('should format 7XXXXXXXX to 254XXXXXXXX', () => {
      const formatted = MpesaUtils.formatPhoneNumber('712345678');
      expect(formatted).toBe('254712345678');
    });

    it('should keep 254XXXXXXXX as is', () => {
      const formatted = MpesaUtils.formatPhoneNumber('254712345678');
      expect(formatted).toBe('254712345678');
    });

    it('should handle phone numbers with spaces and dashes', () => {
      const formatted = MpesaUtils.formatPhoneNumber('0712-345-678');
      expect(formatted).toBe('254712345678');
    });

    it('should throw error for invalid phone numbers', () => {
      expect(() => MpesaUtils.formatPhoneNumber('12345')).toThrow('Invalid phone number format');
    });
  });

  describe('getBaseUrl', () => {
    it('should return sandbox URL for sandbox environment', () => {
      const url = MpesaUtils.getBaseUrl('sandbox');
      expect(url).toBe('https://sandbox.safaricom.co.ke');
    });

    it('should return production URL for production environment', () => {
      const url = MpesaUtils.getBaseUrl('production');
      expect(url).toBe('https://api.safaricom.co.ke');
    });
  });

  describe('validateConfig', () => {
    const validConfig: MpesaConfig = {
      consumerKey: 'test_key',
      consumerSecret: 'test_secret',
      environment: 'sandbox',
      shortCode: '174379',
    };

    it('should pass validation for valid config', () => {
      expect(() => MpesaUtils.validateConfig(validConfig)).not.toThrow();
    });

    it('should throw error for missing consumer key', () => {
      const config = { ...validConfig, consumerKey: '' };
      expect(() => MpesaUtils.validateConfig(config)).toThrow('Missing required configuration');
    });

    it('should throw error for invalid environment', () => {
      const config = { ...validConfig, environment: 'invalid' as any };
      expect(() => MpesaUtils.validateConfig(config)).toThrow('Environment must be either');
    });
  });

  describe('generateTransactionRef', () => {
    it('should generate unique transaction references', () => {
      const ref1 = MpesaUtils.generateTransactionRef();
      const ref2 = MpesaUtils.generateTransactionRef();
      
      expect(ref1).not.toBe(ref2);
      expect(ref1).toMatch(/^TXN_\d+_[A-Z0-9]{6}$/);
    });

    it('should use custom prefix', () => {
      const ref = MpesaUtils.generateTransactionRef('CUSTOM');
      expect(ref).toMatch(/^CUSTOM_\d+_[A-Z0-9]{6}$/);
    });
  });

  describe('retry', () => {
    it('should succeed on first try', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const result = await MpesaUtils.retry(operation, 3, 100);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');
      
      const result = await MpesaUtils.retry(operation, 3, 10);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should throw last error after max retries', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('always fails'));
      
      await expect(MpesaUtils.retry(operation, 2, 10)).rejects.toThrow('always fails');
      expect(operation).toHaveBeenCalledTimes(2);
    });
  });

  describe('sanitizeCallbackData', () => {
    it('should mask phone numbers in callback data', () => {
      const callbackData = {
        Body: {
          stkCallback: {
            CallbackMetadata: {
              Item: [
                { Name: 'Amount', Value: 1000 },
                { Name: 'PhoneNumber', Value: '254712345678' },
              ],
            },
          },
        },
      };

      const sanitized = MpesaUtils.sanitizeCallbackData(callbackData);
      const phoneItem = sanitized.Body.stkCallback.CallbackMetadata.Item.find(
        (item: any) => item.Name === 'PhoneNumber'
      );

      expect(phoneItem.Value).toBe('********5678');
    });
  });
});
