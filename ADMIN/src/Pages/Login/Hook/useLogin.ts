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
      const { data } = response;
      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;
      const userName = data.userName;
      const email = data.email ?? null; 
      const userImg = data.userImg ?? null; 
      const id = data.id;
      const authenticated = data.authenticated;

      if (accessToken && refreshToken && userName && id && authenticated) {
   
        setTokens(accessToken, refreshToken, userName, email, userImg, id);
        // console.log('Tokens set successfully, check localStorage');
      } else {
    
        // console.error('Missing required data in response:', {
        //   hasAccessToken: !!accessToken,
        //   hasRefreshToken: !!refreshToken,
        //   hasUserName: !!userName,
        //   hasId: !!id,
        //   hasAuthenticated: authenticated,
        //   email: email,
        //   userImg: userImg,
        //   fullData: data
        // });
      }
    },
    // onError: (error) => {
    //   console.error('Login mutation error:', error);
    // },
  });
};