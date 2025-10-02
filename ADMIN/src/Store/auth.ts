// store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  id: string | null;
  setTokens: (accessToken: string | null, refreshToken: string | null, userName: string | null, id: string | null) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userName: null,
      id: null,
      setTokens: (accessToken, refreshToken, userName, id) =>
        set({ accessToken, refreshToken, userName, id }),
      clearTokens: () =>
        set({ accessToken: null, refreshToken: null, userName: null, id: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
