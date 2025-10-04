
import { AuthState } from '@/Interface/Auth/ILogin';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
