import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AuthUser, Lookup, Response } from '@shared/types';
import { isDevelopment } from '@shared/utils';

interface AppState {
  // App status
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;

  // User data
  currentUser: AuthUser | null;

  // Lookups data
  lookups: Lookup | null;
  isLookupsLoading: boolean;

  // Actions
  initialize: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentUser: (user: AuthUser | null) => void;
  setLookups: (lookups: Response<Lookup>) => void;
  setLookupsLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState = {
  isInitialized: false,
  isLoading: false,
  error: null,
  currentUser: null,
  lookups: null,
  isLookupsLoading: false,
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

      setLookups: (lookups: Lookup) => {
        set({ lookups, isLookupsLoading: false }, false, 'setLookups');
      },

      setLookupsLoading: (isLookupsLoading: boolean) => {
        set({ isLookupsLoading }, false, 'setLookupsLoading');
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
