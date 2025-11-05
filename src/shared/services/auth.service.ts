import { apiService } from './api.service';
import { type Response, type LoginRequest } from '@shared/types';
import {
  decodeJWTToken,
  extractUserFromJWT,
  removeToken,
} from '@shared/utils/auth.utils';
import { isDevelopment, logger } from '@shared/utils';

export const authService = {
  async login(userName: string, password: string): Promise<string> {
    try {
      const loginData: LoginRequest = { userName, password };

      const response: Response<string> = await apiService.post<string>(
        '/login',
        loginData
      );

      if (response.data) {
        // Store the token in localStorage
        localStorage.setItem('auth_token', response.data);

        // Decode JWT token and extract user info
        const payload = decodeJWTToken(response.data);
        if (payload) {
          const userInfo = extractUserFromJWT(payload);
          localStorage.setItem('user_info', JSON.stringify(userInfo));
        }

        return response.data;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: unknown) {
      // Remove any existing tokens on login failure
      removeToken();

      // Re-throw the error for the component to handle
      if (isDevelopment()) {
        logger.error('Change Password Error', error);
      }

      // Re-throw the original error to preserve all details
      throw error;
    }
  },

  logout() {
    // Clear tokens and user info using auth utils
    removeToken();
  },
};
