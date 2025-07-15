import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { MpesaConfig, AuthResponse } from '../types';
import { MpesaUtils } from '../utils';

export class HttpClient {
  private client: AxiosInstance;
  private config: MpesaConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: MpesaConfig) {
    this.config = config;
    const baseURL = MpesaUtils.getBaseUrl(config.environment);
    
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(
      async (config) => {
        if (config.url !== '/oauth/v1/generate' && !config.headers.Authorization) {
          const token = await this.getAccessToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear it
          this.accessToken = null;
          this.tokenExpiry = null;
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Get access token from Safaricom OAuth API
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const credentials = Buffer.from(
        `${this.config.consumerKey}:${this.config.consumerSecret}`
      ).toString('base64');

      const response: AxiosResponse<AuthResponse> = await this.client.get(
        '/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      // Set expiry to 5 minutes before actual expiry (default is 1 hour)
      const expiryInMs = (parseInt(response.data.expires_in) - 300) * 1000;
      this.tokenExpiry = new Date(Date.now() + expiryInMs);

      return this.accessToken;
    } catch (error) {
      throw new Error(`Failed to get access token: ${this.getErrorMessage(error)}`);
    }
  }

  /**
   * Make GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Make POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Format error response
   */
  private formatError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      const message = data?.errorMessage || data?.ResponseDescription || error.message;
      const formattedError = new Error(`HTTP ${status}: ${message}`);
      (formattedError as any).status = status;
      (formattedError as any).data = data;
      return formattedError;
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error: No response received from server');
    } else {
      // Something else happened
      return new Error(`Request error: ${error.message}`);
    }
  }

  /**
   * Get error message from various error formats
   */
  private getErrorMessage(error: any): string {
    if (error.response?.data?.errorMessage) {
      return error.response.data.errorMessage;
    }
    if (error.response?.data?.ResponseDescription) {
      return error.response.data.ResponseDescription;
    }
    if (error.message) {
      return error.message;
    }
    return 'Unknown error occurred';
  }

  /**
   * Clear access token (useful for testing or manual token refresh)
   */
  clearToken(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get current token info (for debugging)
   */
  getTokenInfo(): { token: string | null; expiry: Date | null } {
    return {
      token: this.accessToken,
      expiry: this.tokenExpiry,
    };
  }
}
