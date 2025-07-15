import * as crypto from 'crypto';
import * as fs from 'fs';
import moment from 'moment';
import { MpesaConfig } from '../types';

export class MpesaUtils {
  /**
   * Generate timestamp in the format YYYYMMDDHHMMSS
   */
  static generateTimestamp(): string {
    return moment().format('YYYYMMDDHHmmss');
  }

  /**
   * Generate password for STK Push
   */
  static generatePassword(shortCode: string, passkey: string, timestamp: string): string {
    const data = shortCode + passkey + timestamp;
    return Buffer.from(data).toString('base64');
  }

  /**
   * Generate security credential by encrypting the initiator password with the certificate
   */
  static generateSecurityCredential(initiatorPassword: string, certificatePath: string): string {
    try {
      const certificate = fs.readFileSync(certificatePath, 'utf8');
      const buffer = Buffer.from(initiatorPassword);
      const encrypted = crypto.publicEncrypt({
        key: certificate,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      }, buffer);
      return encrypted.toString('base64');
    } catch (error: any) {
      throw new Error(`Error generating security credential: ${error.message}`);
    }
  }

  /**
   * Format phone number to international format (254XXXXXXXX)
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove any spaces, dashes, or plus signs
    let cleaned = phoneNumber.replace(/[\s\-+]/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('0')) {
      // Convert 07XXXXXXXX to 254XXXXXXXX
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7')) {
      // Convert 7XXXXXXXX to 254XXXXXXXX
      cleaned = '254' + cleaned;
    } else if (cleaned.startsWith('2547')) {
      // Already in correct format
      return cleaned;
    } else if (cleaned.startsWith('254')) {
      // Already in correct format
      return cleaned;
    }

    // Validate the final format
    if (!/^254[0-9]{9}$/.test(cleaned)) {
      throw new Error('Invalid phone number format. Expected format: 254XXXXXXXX');
    }

    return cleaned;
  }

  /**
   * Get base URL for the environment
   */
  static getBaseUrl(environment: 'sandbox' | 'production'): string {
    return environment === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';
  }

  /**
   * Validate configuration
   */
  static validateConfig(config: MpesaConfig): void {
    const required: (keyof MpesaConfig)[] = ['consumerKey', 'consumerSecret', 'environment', 'shortCode'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }

    if (!['sandbox', 'production'].includes(config.environment)) {
      throw new Error('Environment must be either "sandbox" or "production"');
    }
  }

  /**
   * Generate transaction reference
   */
  static generateTransactionRef(prefix: string = 'TXN'): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Sanitize callback data
   */
  static sanitizeCallbackData(data: any): any {
    // Remove sensitive information from callback data before logging
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // Remove or mask sensitive fields
    if (sanitized.Body?.stkCallback?.CallbackMetadata?.Item) {
      sanitized.Body.stkCallback.CallbackMetadata.Item = 
        sanitized.Body.stkCallback.CallbackMetadata.Item.map((item: any) => {
          if (item.Name === 'PhoneNumber') {
            return { ...item, Value: this.maskPhoneNumber(item.Value) };
          }
          return item;
        });
    }

    return sanitized;
  }

  /**
   * Mask phone number for logging
   */
  private static maskPhoneNumber(phoneNumber: string): string {
    if (typeof phoneNumber !== 'string' || phoneNumber.length < 4) {
      return phoneNumber;
    }
    const visible = phoneNumber.slice(-4);
    const masked = '*'.repeat(phoneNumber.length - 4);
    return masked + visible;
  }

  /**
   * Retry mechanism for API calls
   */
  static async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Wait before retrying
        await new Promise<void>(resolve => setTimeout(resolve, delay * attempt));
      }
    }

    throw lastError!;
  }
}
