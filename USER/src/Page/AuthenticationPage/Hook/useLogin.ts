
import { useMutation } from '@tanstack/react-query';
import type { ILoginRequest, ILoginResponse } from '../../../Interface/Auth/ILogin';
import { auth_api_handler } from '../../../Api/Api_Handler/auth_api';
import type { IApiResponse } from '../../../Interface/IApiResponse';
import { useAuthStore } from '../../../Middleware/useAuthStoreWithLocal';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (body: ILoginRequest) => auth_api_handler.Login(body),
    onSuccess: async (response: IApiResponse<ILoginResponse>) => {
      const { data } = response;
      const accessToken = data.accessToken;
      const userName = data.userName;
      const email = data.email ?? null;
      const userImg = data.userImg ?? null;
      const id = data.id;
      const authenticated = data.authenticated;

      // refreshToken cung duoc tra ve trong body (ADMIN/Mobile dung), nhung USER
      // app khong can luu - backend da set no vao cookie httpOnly roi.
      if (accessToken && userName && id && authenticated) {
        setAuth(accessToken, userName, email, userImg, id);

        //? Delay lại 1 chút
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    },
  });
};