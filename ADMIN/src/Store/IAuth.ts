
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
      setTokens: (
        accessToken: string | null,
        refreshToken: string | null,
        userName: string | null,  
        email: string | null,
        userImg: string | null,
        id: string | null         
      ) => {
        console.log('setTokens called with correct order:', { 
          accessToken: accessToken ? '***' : null,
          refreshToken: refreshToken ? '***' : null,
          userName,
          id,
          email,
          userImg 
        });
        
        set({ 
          accessToken, 
          refreshToken, 
          userName, 
          email, 
          userImg, 
          id 
        }); 

        // //? Log localStorage sau persist (tăng timeout nếu cần, hoặc dùng callback nếu có)
        // setTimeout(() => {
        //   // const stored = localStorage.getItem('auth-storage');
        //   // console.log('localStorage after persist:', stored ? JSON.parse(stored) : null);
        // }, 200); 
      },
      clearTokens: () => {
        set({ 
          accessToken: null, 
          refreshToken: null, 
          userName: null, 
          email: null, 
          userImg: null, 
          id: null 
        });
        localStorage.removeItem('auth-storage');
        console.log('Tokens cleared from state and localStorage');
      },
    }),
    {
      name: 'auth-storage', 
    }
  )
);