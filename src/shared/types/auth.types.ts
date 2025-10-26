// Authentication-related types and interfaces

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterResponse {
  token: string;
  user: AuthUser;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// JWT Token payload interface
export interface JWTPayload {
  nameid: string; // user ID
  unique_name: string; // email
  role: string; // user role
  iat?: number; // issued at
  exp?: number; // expiration
  iss?: string; // issuer
  aud?: string; // audience
}

// Permission and role types
export type UserRole =
  | 'Admin'
  | 'Project Creator'
  | 'Annotator'
  | 'Supervisor'
  | 'Inspector';

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}
