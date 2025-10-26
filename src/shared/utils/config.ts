import type { AppConfig } from '@shared/types';

export const getConfig = (): AppConfig => {
  return {
    apiBaseUrl:
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678/api',
    appName: import.meta.env.VITE_APP_NAME || 'Headway ERP',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENV || 'local',
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  };
};

export const config = getConfig();

export const isDevelopment = () =>
  config.environment === 'local' || config.environment === 'development';
export const isProduction = () => config.environment === 'production';
