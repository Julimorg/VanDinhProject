import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '../Interface/Auth/IAuth';

/**
 * accessToken CHI song trong memory, khong persist xuong localStorage (xem
 * `partialize` ben duoi) - tranh lo token qua localStorage neu co XSS/lib
 * ngoai bi compromise (Code Review FE USER, muc 2.1). refreshToken khong
 * con can luu o FE nua: no la cookie httpOnly do backend set, trinh duyet
 * tu gui kem moi request, JS khong doc duoc va cung khong can doc.
 *
 * Vi accessToken mat sau khi reload trang, app can "silent refresh" luc
 * khoi dong (goi /auth/refresh-token, dua vao cookie httpOnly) de lay lai
 * accessToken moi - xem Provider/AuthBootstrap.tsx. `isBootstrapped` bao
 * cho router biet khi nao buoc nay xong, tranh flash-redirect ve /login.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userName: null,
      email: null,
      userImg: null,
      id: null,
      isBootstrapped: false,
      setAuth: (accessToken, userName, email, userImg, id) => {
        set({ accessToken, userName, email, userImg, id });
      },
      clearAuth: () => {
        set({ accessToken: null, userName: null, email: null, userImg: null, id: null });
        localStorage.removeItem('auth-storage');
      },
      setBootstrapped: (value) => set({ isBootstrapped: value }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        userName: state.userName,
        email: state.email,
        userImg: state.userImg,
        id: state.id,
      }),
    }
  )
);
