export interface ErrorBase {
  message: string;
  code: number;
  status: number;
  details?: {
    errorCode?: string;
  };
}

export const IDENTITY_ERROR_MESSAGES: Record<string, string> = {
  'identity/invalid-credential': 'Invalid credentials.',
  'identity/user-not-found': 'User not found.',
  'identity/microsoft/token-validation-error':
    'Microsoft token validation failed.',
  'identity/google/token-validation-error': 'Google token validation failed.',
  'identity/google/duplicate-email': 'Google account already in use.',
  'identity/forgot-password/social-user':
    'Cannot reset password for social login user.',
  'identity/duplicate-email': 'This email is already registered.',
  'identity/unexpected-error': 'An unexpected error occurred.',
  'identity/reset-password/invalid-token': 'Invalid or expired token.',
  'identity/validation-error': 'Validation error occurred.',
  'identity/user-suspended': 'User account is temporarily suspended.',
  'identity/user-disabled': 'User account is disabled.',
};
