import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import {
  Layout,
  ErrorBoundary,
  LoadingSpinner,
  ThemeProvider,
} from '@shared/components';
import { routes } from './index';
import { AuthGuard, GuestOnly, ProtectedRedirect } from '@shared/guards';
import { useRoutePreloading, usePageTitle } from '@shared/hooks';
import { Toaster } from '@/shared/components/ui';

// Lazy load authentication-related components
const Login = lazy(() =>
  import('@features/login').then((module) => ({
    default: module.Login,
  }))
);

function AppRoutes() {
  usePageTitle();
  useRoutePreloading();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Suspense fallback={<LoadingSpinner message="Loading login..." />}>
              <Login />
            </Suspense>
          </GuestOnly>
        }
      />

      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              {/* Root path redirect */}
              <Route index element={<ProtectedRedirect />} />
              {routes
                .filter((route) => route.path !== '/login')
                .map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <AuthGuard requireAuth={true} redirectTo="/login">
                        <Suspense fallback={<LoadingSpinner />}>
                          <route.element />
                        </Suspense>
                      </AuthGuard>
                    }
                  />
                ))}
              {/* Redirect unknown routes to projects if authenticated, login if not */}
              <Route path="*" element={<ProtectedRedirect />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export function AppRouter() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AppRoutes />
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
