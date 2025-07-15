// Main exports
export { MpesaService } from './services/mpesaService';
export { HttpClient } from './services/httpClient';
export { MpesaUtils } from './utils';

// Type exports
export * from './types';

// Create a default class for backward compatibility
import { MpesaService } from './services/mpesaService';
import { MpesaConfig } from './types';

/**
 * Default Mpesa class for backward compatibility and convenience
 */
export class Mpesa extends MpesaService {
  constructor(config: MpesaConfig) {
    super(config);
  }

  /**
   * Create Mpesa instance from environment variables
   */
  static fromEnv(): Mpesa {
    const config: MpesaConfig = {
      consumerKey: process.env.MPESA_CONSUMER_KEY || '',
      consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
      environment: (process.env.MPESA_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      shortCode: process.env.MPESA_SHORT_CODE || '',
      initiatorName: process.env.MPESA_INITIATOR_NAME,
      securityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
      certificatePath: process.env.MPESA_CERTIFICATE_PATH,
      passkey: process.env.MPESA_PASSKEY,
    };

    return new Mpesa(config);
  }
}

// Default export
export default Mpesa;
