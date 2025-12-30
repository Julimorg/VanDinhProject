
import { useMutation } from '@tanstack/react-query';
import type { ILoginRequest, ILoginResponse } from '../../../Interface/Auth/ILogin';
import { auth_api_handler } from '../../../Api/Api_Handler/auth_api';
import type { IApiResponse } from '../../../Interface/IApiResponse';
import { useAuthStore } from '../../../Middleware/useAuthStoreWithLocal';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: (body: ILoginRequest) => auth_api_handler.Login(body),
    onSuccess: async (response: IApiResponse<ILoginResponse>) => {
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

        //? Delay lại 1 chút
        await new Promise(resolve => setTimeout(resolve, 50));


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