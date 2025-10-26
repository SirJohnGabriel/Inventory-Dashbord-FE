import { apiService } from './api.service';
import {
  type Response,
  type LoginRequest,
  IDENTITY_ERROR_MESSAGES,
  type ErrorBase,
} from '@shared/types';
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
      const loginError = error as ErrorBase;
      const errorCode = loginError.details?.errorCode;
      throw new Error(
        (errorCode && IDENTITY_ERROR_MESSAGES[errorCode]) || 'Login failed'
      );
    }
  },

  logout() {
    // Clear tokens and user info using auth utils
    removeToken();
  },
};
