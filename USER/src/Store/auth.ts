import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  id: string | null;
  user_id: string | null;
  setTokens: (accessToken: string | null, refreshToken: string | null, userName: string | null, user_id: string | null) => void;
  clearTokens: () => void;
  setLanguageId: (id: string|null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userName: null,
      id: null,
      user_id: null,
      setTokens: (accessToken, refreshToken, userName, user_id) =>
        set({ accessToken, refreshToken, userName, user_id}),
      clearTokens: () =>
        set({ accessToken: null, refreshToken: null, userName: null, id: null, user_id: null }),
      setLanguageId: (id) => set({ id }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
