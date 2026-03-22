import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

const AUTH_STORAGE_KEY = '@closet/auth';

interface AuthState {
  userId: string | null;
  userName: string | null;
  userPhone: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (userId: string, userName: string, userPhone: string) => void;
  clearUser: () => void;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  userName: null,
  userPhone: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (userId: string, userName: string, userPhone: string) => {
    // Set the auth header for API calls (dev mode uses x-user-id)
    api.setAuthToken(userId);

    // Persist to storage
    AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ userId, userName, userPhone }));

    set({ userId, userName, userPhone, isAuthenticated: true, isLoading: false });
  },

  clearUser: () => {
    api.setAuthToken(null);
    AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    set({
      userId: null,
      userName: null,
      userPhone: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  loadFromStorage: async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { userId, userName, userPhone } = JSON.parse(stored);
        api.setAuthToken(userId);
        set({ userId, userName, userPhone, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
