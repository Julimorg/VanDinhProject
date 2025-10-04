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
    const accessToken = response.data.accessToken;
    const refreshToken = response.data.accessToken;
    const userId = response.data.id;
    const userName = response.data.userName;
    const email =  response.data.email;
    const userImg = response.data.userImg;

    if (accessToken && refreshToken && userName && userId && email && userImg) {
      setTokens(accessToken, refreshToken, userName , userId, email, userImg);
      // console.log('lưu token vào store:', accessToken, refreshToken,userName);
    } 
  },

  });
};
 