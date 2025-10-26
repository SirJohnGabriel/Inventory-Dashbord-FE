import { AxiosError } from 'axios';

export interface AppError {
  message: string;
  code?: string | number;
  status?: number;
  details?: Record<string, unknown>;
}

/**
 * Normalizes different types of errors into a consistent AppError format
 */
export function normalizeError(error: unknown): AppError {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;

    return {
      message: data?.message || error.message || 'Network error occurred',
      code: data?.code || status,
      status,
      details: data,
    };
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return {
      message: error.message,
      details: { stack: error.stack },
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }

  // Handle object-like errors
  if (error && typeof error === 'object') {
    const errorObj = error as Record<string, unknown>;
    return {
      message: (errorObj.message as string) || 'An unknown error occurred',
      code: errorObj.code as string | number | undefined,
      status: errorObj.status as number | undefined,
      details: errorObj,
    };
  }

  // Fallback for unknown error types
  return {
    message: 'An unknown error occurred',
    details: error as Record<string, unknown>,
  };
}

/**
 * Checks if an error is a network-related error
 */
export function isNetworkError(error: AppError): boolean {
  return (
    error.status === undefined ||
    error.status === 0 ||
    error.message.includes('Network Error')
  );
}

/**
 * Checks if an error is an authentication error
 */
export function isAuthError(error: AppError): boolean {
  return error.status === 401 || error.status === 403;
}

/**
 * Checks if an error is a validation error
 */
export function isValidationError(error: AppError): boolean {
  return error.status === 400 || error.status === 422;
}

/**
 * Gets a user-friendly error message
 */
export function getUserFriendlyMessage(error: AppError): string {
  if (isNetworkError(error)) {
    return 'Please check your internet connection and try again.';
  }

  if (isAuthError(error)) {
    return 'Please log in to continue.';
  }

  if (isValidationError(error)) {
    return error.message || 'Please check your input and try again.';
  }

  if (error.status && error.status >= 500) {
    return 'A server error occurred. Please try again later.';
  }

  return error.message || 'An unexpected error occurred.';
}
