
import { useMutation } from '@tanstack/react-query';
import { useAuthStoreCookiesStorage } from '../../../Middleware/useAuthStore';
import type { ILoginRequest, ILoginResponse } from '../../../Interface/Auth/ILogin';
import { auth_api_handler } from '../../../Api/Api_Handler/auth_api';
import type { IApiResponse } from '../../../Interface/IApiResponse';

export const useLogin = () => {
  const setTokens = useAuthStoreCookiesStorage((state) => state.setTokens);

  return useMutation({
    mutationFn: (body: ILoginRequest) => auth_api_handler.Login(body),
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