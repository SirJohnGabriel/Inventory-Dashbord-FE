import { Navigate } from 'react-router-dom';
import { authService } from '@shared/services/auth.service';
import {
  isAuthenticated,
  getCurrentUser,
  getToken,
} from '@shared/utils/auth.utils';
import type { AuthUser, UserRole } from '@shared/types';

interface AuthGuardProps {
  children?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  fallbackComponent?: React.ComponentType;
}

/**
 * AuthGuard component that handles authentication and authorization-based routing
 *
 * @param children - Components to render if authentication check passes
 * @param redirectTo - Path to redirect to if authentication check fails
 * @param requireAuth - Whether authentication is required (default: true)
 * @param requiredRole - Specific role required to access the route
 * @param allowedRoles - Array of roles allowed to access the route
 * @param fallbackComponent - Component to render if unauthorized (instead of redirect)
 */
export function AuthGuard({
  children,
  redirectTo,
  requireAuth = true,
  requiredRole,
  allowedRoles,
  fallbackComponent: FallbackComponent,
}: AuthGuardProps) {
  const isUserAuthenticated = isAuthenticated();
  const currentUser: AuthUser | null = getCurrentUser();
  const token = getToken();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isUserAuthenticated) {
    return <Navigate to={redirectTo || '/login'} replace />;
  }

  // If authentication is not required but user is authenticated
  if (!requireAuth && isUserAuthenticated) {
    return <Navigate to={redirectTo || '/projects'} replace />;
  }

  // Role-based authorization checks
  if (isUserAuthenticated && (requiredRole || allowedRoles)) {
    const userRole = currentUser?.role as UserRole;

    // Check if user has the required role
    if (requiredRole && userRole !== requiredRole) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return <Navigate to={redirectTo || '/unauthorized'} replace />;
    }

    // Check if user role is in allowed roles
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return <Navigate to={redirectTo || '/unauthorized'} replace />;
    }
  }

  // Token validation check (additional security layer)
  if (requireAuth && isUserAuthenticated && !token) {
    // Edge case: isUserAuthenticated is true but no token exists
    authService.logout();
    return <Navigate to="/login" replace />;
  }

  // If children are provided, render them, otherwise redirect
  if (children) {
    return <>{children}</>;
  }

  // Default behavior: redirect based on authentication status
  return <Navigate to={isUserAuthenticated ? '/projects' : '/login'} replace />;
}

/**
 * ProtectedRedirect component for simple authentication-based redirects
 * Redirects to /projects if authenticated, /login if not
 */
export function ProtectedRedirect() {
  return <AuthGuard />;
}

/**
 * RequireAuth component that protects routes requiring authentication
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  return <AuthGuard requireAuth={true}>{children}</AuthGuard>;
}

/**
 * GuestOnly component that redirects authenticated users away
 */
export function GuestOnly({ children }: { children: React.ReactNode }) {
  return <AuthGuard requireAuth={false}>{children}</AuthGuard>;
}

/**
 * AdminOnly component that requires admin role
 */
export function AdminOnly({
  children,
  fallbackComponent,
}: {
  children: React.ReactNode;
  fallbackComponent?: React.ComponentType;
}) {
  return (
    <AuthGuard
      requireAuth={true}
      requiredRole="Admin"
      fallbackComponent={fallbackComponent}
    >
      {children}
    </AuthGuard>
  );
}

/**
 * RoleGuard component for specific role-based protection
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallbackComponent,
  redirectTo,
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackComponent?: React.ComponentType;
  redirectTo?: string;
}) {
  return (
    <AuthGuard
      requireAuth={true}
      allowedRoles={allowedRoles}
      fallbackComponent={fallbackComponent}
      redirectTo={redirectTo}
    >
      {children}
    </AuthGuard>
  );
}

/**
 * WithUser component that provides current user data to children
 */
export function WithUser({
  children,
}: {
  children: (user: AuthUser | null) => React.ReactNode;
}) {
  const currentUser = getCurrentUser();
  return <>{children(currentUser)}</>;
}

/**
 * AuthStatus component that renders different content based on auth status
 */
export function AuthStatus({
  authenticated,
  unauthenticated,
  loading,
}: {
  authenticated?: React.ReactNode;
  unauthenticated?: React.ReactNode;
  loading?: React.ReactNode;
}) {
  const isUserAuthenticated = isAuthenticated();
  const token = getToken();

  // Show loading state if token exists but user info is being fetched
  if (token && !getCurrentUser() && loading) {
    return <>{loading}</>;
  }

  if (isUserAuthenticated && authenticated) {
    return <>{authenticated}</>;
  }

  if (!isUserAuthenticated && unauthenticated) {
    return <>{unauthenticated}</>;
  }

  return null;
}
