// Store/IAuth.ts (hoặc file store của bạn)
import { AuthState } from '@/Interface/Auth/ILogin';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Thêm createJSONStorage

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      userName: null,
      id: null,
      setTokens: (accessToken, refreshToken, userName, id) => {
        console.log('setTokens called:', { accessToken, refreshToken, userName, id}); // Debug: Kiểm tra setTokens chạy không
        set({ accessToken, refreshToken, userName, id});
        // Log localStorage sau set (persist async, log sau 100ms)
        setTimeout(() => {
          console.log('localStorage after persist:', localStorage.getItem('auth-storage'));
        }, 100);
      },
      clearTokens: () => {
        set({ accessToken: null, refreshToken: null, userName: null, id: null});
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage), // Explicit storage để tránh fallback
      onRehydrateStorage: (state) => {
        console.log('Rehydrate from localStorage on load:', state); // Debug khi reload trang
        return (state, error) => {
          if (error) {
            console.error('Persist rehydrate error:', error); // Log lỗi persist
          }
        };
      },
    }
  )
);