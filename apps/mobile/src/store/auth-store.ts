import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  userName: string | null;
  isAuthenticated: boolean;
  setUser: (userId: string, userName: string) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  userName: null,
  isAuthenticated: false,

  setUser: (userId: string, userName: string) =>
    set({ userId, userName, isAuthenticated: true }),

  clearUser: () =>
    set({ userId: null, userName: null, isAuthenticated: false }),
}));
