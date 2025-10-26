import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { Response } from '../types';
import { config, logger, normalizeError } from '../utils';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        logger.debug('API Request:', config);

        return config;
      },
      (error) => {
        logger.error('API Request Error:', error);
        return Promise.reject(normalizeError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        logger.debug('API Response:', response);
        return response;
      },
      (error) => {
        const normalizedError = normalizeError(error);
        logger.error('API Error:', normalizedError);

        // Handle common error scenarios
        if (normalizedError.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          logger.warn('User token expired, redirecting to login');
          // You might want to redirect to login page
        }

        return Promise.reject(normalizedError);
      }
    );
  }

  // Generic methods
  async get<T = unknown>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<Response<T>> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: Record<string, unknown>
  ): Promise<Response<T>> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = unknown>(url: string, data?: unknown): Promise<Response<T>> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async patch<T = unknown>(url: string, data?: unknown): Promise<Response<T>> {
    const response = await this.client.patch(url, data);
    return response.data;
  }

  async delete<T = unknown>(url: string): Promise<Response<T>> {
    const response = await this.client.delete(url);
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export the class for testing or multiple instances
export { ApiService };
