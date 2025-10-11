
import axiosClient from './axiosClient';
import { ChangePass, ChangePassResponse } from '@/Interface/TChangePass';
import { ILoginRequest, ILoginResponse} from '@/Interface/Auth/ILogin';
import { IApiResponse } from '@/Interface/IApiResponse';
import { IRefreshTokenResponse } from '@/Interface/Auth/IRefreshToken';
import { useAuthStore } from '@/Store/IAuth';
import { IApiResponsePagination } from '@/Interface/IApiResponsePagination';
import { IUsersResponse } from '@/Interface/Users/IGetUsers';
import { ILogOutRequest } from '@/Interface/Auth/ILogOut';
import { IGetMyProfileResponse } from '@/Interface/Users/IGetMyProfile';
import { IUdpateMyProfileRequest, IUpdateMyProfileResponse } from '../Interface/Users/IUpdateMyProfile';
import { ICreateUserRequest, ICreateUserResponse } from '@/Interface/Users/ICreateUser';
import { IGetUserDetailResponse } from '@/Interface/Users/IGetUserDetail';
import { IUpdateUserRequest, IUpdateUserResponse } from '@/Interface/Users/IUpdateUser';


export const docApi = {

  //* ======================================================== Auth  ======================================================== */
  
  Login: async (body: ILoginRequest): Promise<IApiResponse<ILoginResponse>> => {
        const url = `/auth/log-in`
        const res = await axiosClient.post(url, body)
        return res.data
    },
    
  LogOut: async (body: ILogOutRequest): Promise<IApiResponse<void>> => {
    const url = '/auth/log-out';
    const res = await axiosClient.post(url, body);
    return res.data;
  },  

  RefreshToken: async (): Promise<IApiResponse<IRefreshTokenResponse>> => {
    const url = '/auth/refresh-token';
    const refreshToken = useAuthStore.getState().refreshToken;
    
    if (!refreshToken) {
      console.error('Không có refresh token trong store');
      throw new Error('Không có refresh token');
    }

    console.log('Gửi yêu cầu refresh token:', { url, refreshToken });

    try {
      console.log('Bat dau refresh token nha');
      const res = await axiosClient.get<IApiResponse<IRefreshTokenResponse>>(url, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      console.log('Nhận response refresh token:', res.data);
      if (!res.data.data.accessToken) {
        throw new Error('Response refresh token không hợp lệ');
      }
      return res.data;
    } catch (error) {
      console.error('Lỗi khi gọi API refresh token:', {
        // message: error.message,
        // response: error.response?.data,
        // status: error.response?.status,
      });
      throw error;
    }
  },

  //* ======================================================== USERS  ======================================================== */

  GetAllUsers: async (
    params: {
      status?: string;
      page?: number;
      size?: number;
      sort?: string;
      search?: string;
    } = {}
  ): Promise<IApiResponse<IApiResponsePagination<IUsersResponse>>> => {
    const { status, page = 1, size = 5, sort = 'createAt,desc', search } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      ...(status && status !== 'all' && { status }),
      ...(search && { search }), 
    });

    const url = `/users/get-user?${queryParams.toString()}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetMyProfile: async(userId: string): Promise<IApiResponse<IGetMyProfileResponse>> => {
    const url = `/users/view-profile/${userId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetUserDetail: async(userId: string): Promise<IApiResponse<IGetUserDetailResponse>> => {
    const url = `/users/get-profile/${userId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  DeleteUser: async(userId: string): Promise<IApiResponse<void>> => {
    const url =  `/users/delete-user/${userId}`
    const res = await axiosClient.delete(url);
    return res.data;
  },
   
  UpdateMyProfile: async (
      body: IUdpateMyProfileRequest,
      userId: string
    ): Promise<IApiResponse<IUpdateMyProfileResponse>> => {
      const url = `/users/update-profile/${userId}`;
      const formData = new FormData();
      
      if (body.firstName !== undefined) formData.append('firstName', body.firstName);
      if (body.lastName !== undefined) formData.append('lastName', body.lastName);
      if (body.userName !== undefined) formData.append('userName', body.userName);
      if (body.email !== undefined) formData.append('email', body.email);
      if (body.phone !== undefined) formData.append('phone', body.phone);
      if (body.userDob !== undefined) formData.append('userDob', body.userDob.toString());
      if (body.userImg instanceof File) formData.append('userImg', body.userImg);
      if (body.userAddress) formData.append('userAddress', body.userAddress);
  
      for (const pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]); 
      }


      const res = await axiosClient.patch(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data; charset=utf-8',
        },
      });      

      console.log('API Response:', res.data);
      return res.data;
    },

  CreateUser: async(body: ICreateUserRequest,): Promise<IApiResponse<ICreateUserResponse>> => {
    const url = `/users/create-staff`;
    const formData = new FormData();

    if (body.firstName !== undefined) formData.append('firstName', body.firstName);
    if (body.lastName !== undefined) formData.append('lastName', body.lastName);
    if (body.userName !== undefined) formData.append('userName', body.userName);
    if (body.email !== undefined) formData.append('email', body.email);
    if (body.phone !== undefined) formData.append('phone', body.phone);
    if (body.userDob !== undefined) formData.append('userDob', body.userDob.toString());
    if (body.password !== undefined) formData.append('password', body.password);
    if (body.userImg instanceof File) formData.append('userImg', body.userImg);
    if (body.userAddress) formData.append('userAddress', body.userAddress);
    if (body.roles !== undefined && body.roles.length > 0) {
      body.roles.forEach((role) => {
        formData.append('roles', role);
      });
    }

    const res = await axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });

    return res.data;
  },

  UpdateUser: async(body: IUpdateUserRequest, userId: string): Promise<IApiResponse<IUpdateUserResponse>> => {
    const url = `/users/update-user/${userId}`;
    const formData = new FormData();

    if (body.firstName !== undefined) formData.append('firstName', body.firstName);
    if (body.lastName !== undefined) formData.append('lastName', body.lastName);
    if (body.userName !== undefined) formData.append('userName', body.userName);
    if (body.email !== undefined) formData.append('email', body.email);
    if (body.phone !== undefined) formData.append('phone', body.phone);
    if (body.status !== undefined) formData.append('phone', body.status);
    if (body.userDob !== undefined) formData.append('userDob', body.userDob.toString());
    if (body.userImg instanceof File) formData.append('userImg', body.userImg);
    if (body.userAddress) formData.append('userAddress', body.userAddress);
    if (body.roles !== undefined && body.roles.length > 0) {
      body.roles.forEach((role) => {
        formData.append('roles', role);
      });
    }

    const res = await axiosClient.patch(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });

    return res.data;
  },


  /*--------------------------------------Change Password---------------------------------------------------------------- */
 ChangePass: async (body: ChangePass): Promise<ChangePassResponse> => {
  const url = `/account/change-password`;
  const res = await axiosClient.post(url, body);
  return res.data;
},

}