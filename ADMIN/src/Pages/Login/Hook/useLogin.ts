import { useMutation } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { useAuthStore } from '@/Store/auth';
import { LoginRequest, LoginResponse } from '@/Interface/Auth_Interface/ILogin';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: (body: LoginRequest) => docApi.Login(body),

  onSuccess: (response: LoginResponse) => {
    const accessToken = response.accessToken;
    const refreshToken = response.refreshToken;
    const userId = response.id;
    const userName = response.userName;

    if (accessToken && refreshToken && userName && userId) {
      setTokens(accessToken, refreshToken, userName , userId);
      console.log('lưu token vào store:', accessToken, refreshToken,userName);
    } 
  },

  });
};
 