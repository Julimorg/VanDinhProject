
import { AuthState } from '@/Interface/Auth/IAuth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; 

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userName: null,
      email: null,
      userImg: null,
      id: null,
      setTokens: (accessToken, refreshToken, userName, id, email, userImg) => {
        console.log('setTokens called:', { accessToken, refreshToken, userName, id, email, userImg}); // Debug: Kiểm tra setTokens chạy không
        set({ accessToken, refreshToken, userName, id, email, userImg});
        setTimeout(() => {
          console.log('localStorage after persist:', localStorage.getItem('auth-storage'));
        }, 100);
      },
      clearTokens: () => {
        set({ accessToken: null, refreshToken: null, userName: null, id: null, email: null, userImg: null});
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);