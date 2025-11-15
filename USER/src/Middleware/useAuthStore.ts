import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import cookieStorage from './cookieStorage';
import type { AuthState } from '../Interface/Auth/IAuth';

export const useAuthStoreCookiesStorage = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userName: null,
      email: null,
      userImg: null,
      id: null,
      setTokens: (accessToken, refreshToken,userName, email, userImg, id) =>
        set({ accessToken, refreshToken, userName, email, userImg, id}),
      clearTokens: () =>
        set({accessToken: null, refreshToken: null,userName: null, email: null, userImg: null, id: null}),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => cookieStorage),  
      partialize: (state) => ({ refreshToken: state.refreshToken }),
    }
  )
);

