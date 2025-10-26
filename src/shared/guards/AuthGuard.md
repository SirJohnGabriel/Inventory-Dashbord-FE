# AuthGuard Service Documentation

The AuthGuard service provides authentication-based routing components for the application. It's located in `src/shared/components/AuthGuard.tsx` and offers several reusable components for different authentication scenarios.

## Components

### 1. `AuthGuard`

The main component that handles authentication-based routing logic.

**Props:**

- `children?: React.ReactNode` - Components to render if authentication check passes
- `redirectTo?: string` - Path to redirect to if authentication check fails
- `requireAuth?: boolean` - Whether authentication is required (default: true)

**Usage:**

```tsx
// Protect a route requiring authentication
<AuthGuard requireAuth={true} redirectTo="/login">
  <ProtectedComponent />
</AuthGuard>

// Protect a route for guests only
<AuthGuard requireAuth={false} redirectTo="/projects">
  <LoginComponent />
</AuthGuard>
```

### 2. `ProtectedRedirect`

Simple component for authentication-based redirects without children.

- Redirects to `/projects` if authenticated
- Redirects to `/login` if not authenticated

**Usage:**

```tsx
// In route configuration for unknown routes
<Route path="*" element={<ProtectedRedirect />} />
```

### 3. `RequireAuth`

Wrapper component that protects routes requiring authentication.

**Usage:**

```tsx
// Protect routes that require authentication
<RequireAuth>
  <DashboardComponent />
</RequireAuth>
```

### 4. `GuestOnly`

Wrapper component that redirects authenticated users away.

**Usage:**

```tsx
// For login/register pages that should redirect authenticated users
<GuestOnly>
  <LoginComponent />
</GuestOnly>
```

## Examples

### Route Protection in AppRouter

```tsx
// Protect login route from authenticated users
<Route
  path="/login"
  element={
    <GuestOnly>
      <Login />
    </GuestOnly>
  }
/>

// Handle unknown routes with authentication check
<Route path="*" element={<ProtectedRedirect />} />
```

### Protecting Individual Components

```tsx
// Protect a sensitive component
function AdminPanel() {
  return (
    <RequireAuth>
      <div>Admin only content</div>
    </RequireAuth>
  );
}
```

### Custom Redirects

```tsx
// Custom redirect behavior
<AuthGuard requireAuth={true} redirectTo="/unauthorized">
  <AdminComponent />
</AuthGuard>
```

## Authentication Logic

The AuthGuard service uses `authService.isAuthenticated()` to check if a user has a valid `auth_token` in localStorage. This provides a simple but effective authentication check for the application.

## Benefits

1. **Reusable**: Can be used throughout the application
2. **Flexible**: Multiple components for different use cases
3. **Centralized**: All authentication logic in one place
4. **Type-safe**: Full TypeScript support
5. **Easy to maintain**: Single source of truth for auth routing logic
