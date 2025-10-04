// Hook useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { docApi } from '@/Api/docApi';
import { useAuthStore } from '@/Store/IAuth';
import { ILoginRequest, ILoginResponse } from '@/Interface/Auth/ILogin';
import { IApiResponse } from '@/Interface/IApiResponse';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: (body: ILoginRequest) => docApi.Login(body),
    onSuccess: (response: IApiResponse<ILoginResponse>) => {
      console.log('onSuccess response:', response); // Debug: Kiểm tra response có data không
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken; // Sửa: refreshToken từ response.data.refreshToken, không copy accessToken
      const userId = response.data.id;
      const userName = response.data.userName;
      // const email = response.data.email || null;
      // const userImg = response.data.userImg || null;

      if (accessToken && refreshToken && userName && userId) {
        setTokens(accessToken, refreshToken, userName, userId);
        console.log('Tokens set successfully, check localStorage');
      } else {
        console.error('Missing token/user data in response:', response.data);
      }
    },
    onError: (error) => {
      console.error('Login mutation error:', error); // Debug lỗi mutation
    },
  });
};