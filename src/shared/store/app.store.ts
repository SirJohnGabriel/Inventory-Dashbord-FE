import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AuthUser } from '@shared/types';
import { isDevelopment } from '@shared/utils';

interface AppState {
  // App status
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // User data
  currentUser: AuthUser | null;

  // Actions
  initialize: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentUser: (user: AuthUser | null) => void;
  reset: () => void;
}

const initialState = {
  isInitialized: false,
  isLoading: false,
  error: null,
  currentUser: null,
};

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      ...initialState,

      initialize: () => {
        set({ isInitialized: true }, false, 'initialize');
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, 'setLoading');
      },

      setError: (error: string | null) => {
        set({ error }, false, 'setError');
      },

      setCurrentUser: (currentUser: AuthUser | null) => {
        set({ currentUser }, false, 'setCurrentUser');
      },

      reset: () => {
        set(initialState, false, 'reset');
      },
    }),
    {
      name: 'app-store',
      enabled: isDevelopment(),
    }
  )
);
