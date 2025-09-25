import { useMutation } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import type { Login, LoginResponseTokenData } from '@/Interface/auth';
import { useAuthStore } from '@/Store/auth';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: (body: Login) => docApi.Login(body),

  onSuccess: (response: LoginResponseTokenData) => {
    const accessToken = response.token?.accessToken;
    const refreshToken = response.token?.refreshToken;
    const userName = response.userName;

    if (accessToken && refreshToken && userName) {
      setTokens(accessToken, refreshToken,userName);
      console.log('lưu token vào store:', accessToken, refreshToken,userName);
    } 
  },

  });
};
 