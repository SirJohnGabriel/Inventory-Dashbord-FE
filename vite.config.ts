import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, 'environments'), '');

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      tailwindcss(),
    ],
    envDir: 'environments',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@app': path.resolve(__dirname, 'src/app'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@assets': path.resolve(__dirname, 'src/assets'),
      },
    },
    define: {
      ...Object.keys(env).reduce(
        (prev, key) => {
          if (key.startsWith('VITE_')) {
            prev[`process.env.${key}`] = JSON.stringify(env[key]);
          }
          return prev;
        },
        {} as Record<string, string>
      ),
    },
  };
});
