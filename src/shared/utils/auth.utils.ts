import { jwtDecode } from 'jwt-decode';
import type { JWTPayload, AuthUser } from '../types';
import { logger } from './logger.utils';

// Token management functions
export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
}

// JWT Token decoding using jwt-decode library
export function decodeJWTToken(token: string): JWTPayload | null {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch (error) {
    logger.error('Error decoding JWT token:', error);
    return null;
  }
}

// Helper function to extract user info from JWT payload
export function extractUserFromJWT(payload: JWTPayload): AuthUser {
  return {
    id: payload.nameid,
    email: payload.unique_name,
    name: payload.unique_name, // Using email as name for now
    role: payload.role,
  };
}

// Get current user from token
export function getCurrentUser(): AuthUser | null {
  try {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      return JSON.parse(userInfo);
    }

    // Fallback: try to reconstruct user info from token
    const token = getToken();
    if (token) {
      const payload = decodeJWTToken(token);
      if (payload) {
        const userInfo = extractUserFromJWT(payload);
        // Store the reconstructed user info
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        return userInfo;
      }
    }

    return null;
  } catch {
    return null;
  }
}

// Token validation functions
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJWTToken(token);
    if (!payload || !payload.exp) {
      return true; // Consider invalid or missing exp as expired
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();

  if (!token) {
    return false;
  }

  // Check if token is expired
  if (isTokenExpired(token)) {
    removeToken(); // Clean up expired token
    return false;
  }

  return true;
}

// Role management functions
export function hasRole(role: string): boolean {
  const user = getCurrentUser();
  if (!user || !user.role) return false;

  const target = role.toLowerCase();

  // Handle array of roles
  if (Array.isArray(user.role)) {
    return user.role.some((r) => r.toLowerCase() === target);
  }

  // Handle single role
  return typeof user.role === 'string' && user.role.toLowerCase() === target;
}

export function isAdmin(): boolean {
  return hasRole('admin');
}

export function isManager(): boolean {
  return hasRole('manager');
}

export function isProjectCreator(): boolean {
  return hasRole('project creator');
}

export function isSupervisor(): boolean {
  return hasRole('supervisor');
}

export function isInspector(): boolean {
  return hasRole('inspector');
}

export function isAnnotator(): boolean {
  return hasRole('annotator');
}

// Check if user has any of the specified roles
export function hasAnyRole(roles: string[]): boolean {
  return roles.some((role) => hasRole(role));
}

// Check if user has all of the specified roles
export function hasAllRoles(roles: string[]): boolean {
  return roles.every((role) => hasRole(role));
}

// Extract initials from email address
export function getEmailInitials(email: string): string {
  if (!email) return 'U';

  // Extract the part before @ symbol
  const localPart = email.split('@')[0];

  // If there's a dot in the local part, split by dot and take first letter of each part
  if (localPart.includes('.')) {
    const parts = localPart.split('.');
    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  // If there's no dot, take first two characters or just first if only one character
  if (localPart.length >= 2) {
    return localPart.substring(0, 2).toUpperCase();
  }

  return localPart.charAt(0).toUpperCase();
}
