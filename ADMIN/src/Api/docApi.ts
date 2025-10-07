
import axiosClient from './axiosClient';
import type { TServiceItem } from '@/Interface/TServiceItems';
import {  OrderPayload, OrderResponse } from '@/Interface/SendOder';

import { LanguageResponse } from '@/Interface/TLanguage';
import { MomoResponse, oderMomo } from '@/Interface/TMomo';
import { OffShift, OnShift } from '@/Interface/TShift';
import { SearchResponse } from '@/Interface/TSearchTicket';
import { TicketDetailResponse } from '@/Interface/TTicketDetail';
import { ChangePass, ChangePassResponse } from '@/Interface/TChangePass';
import { OrderSuccessResponse } from '@/Interface/TCash';
import { ILoginRequest, ILoginResponse} from '@/Interface/Auth/ILogin';
import { IApiResponse } from '@/Interface/IApiResponse';
import { IRefreshTokenResponse } from '@/Interface/Auth/IRefreshToken';
import { useAuthStore } from '@/Store/IAuth';
import { IApiResponsePagination } from '@/Interface/IApiResponsePagination';
import { IUsersResponse } from '@/Interface/Users/IGetUsers';
import { ILogOutRequest } from '@/Interface/Auth/ILogOut';
import { IGetMyProfileResponse } from '@/Interface/Users/IGetMyProfile';


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
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
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

  /*--------------------------------------Change Password---------------------------------------------------------------- */
 ChangePass: async (body: ChangePass): Promise<ChangePassResponse> => {
  const url = `/account/change-password`;
  const res = await axiosClient.post(url, body);
  return res.data;
},


  /*--------------------------------------PostOder---------------------------------------------------------------- */
    getLanguage:async ():Promise<LanguageResponse>=>{
      const url = `/language `
      const res = await axiosClient.get<LanguageResponse>(url);
      return res.data
    },

  /*--------------------------------------Sẻvice---------------------------------------------------------------- */
 getService: async (id: string, typeOfCustomer: string, is_Available: string): Promise<TServiceItem> => {
  const url = `/service/${id}?typeOfCustomer=${typeOfCustomer}&is_Available=${is_Available}`;
  const res = await axiosClient.get(url);
  return res.data.data;
},

  /*--------------------------------------PostOder---------------------------------------------------------------- */
  sendOrder: async (body: OrderPayload): Promise<OrderResponse> => {
    // console.log('BODY:',body);
    
    const url = '/order/place-order';
    const res = await axiosClient.post(url, body);
    return res.data;
  },
 /*--------------------------------------Payment - cash---------------------------------------------------------------- */
  OrderSuccess: async (cart_id: string, method: 'cash' ): Promise<OrderSuccessResponse> => {
    const url = `/order/order-successfully/${cart_id}`;
    const res = await axiosClient.post(url,{method});
    // console.log('OrderSuccess response data:', res.data);
    return res.data;
  },
  /*--------------------------------------Payment - momo---------------------------------------------------------------- */
  momoPay: async(body:oderMomo) : Promise<MomoResponse>=>{
    const url = `/momo/momo-payment`;
    const res = await axiosClient.post(url , body);
    return res.data;
  },
  
  /*--------------------------------------Payment---------------------------------------------------------------- */
  getInvoice:async(id:string):Promise<OrderResponse>=>{
    const url = `/order/scan-QR/${id}`
    const res = await axiosClient.get(url)
    return res.data
  },


  /*--------------------------------------OnShift---------------------------------------------------------------- */
  OnShift: async():Promise<OnShift> => {
    const url = `shift/onshift`
    const res = await axiosClient.post(url)
    return res.data
  },

    /*--------------------------------------OffShift---------------------------------------------------------------- */
  OffShift: async():Promise<OffShift> => {
    const url = `shift/offshift`
    const res = await axiosClient.post(url)
    return res.data
  },

    /*--------------------------------------Search Ticket----------------------------------------------------------- */

    SearchTicket:async(customer_email?: string, customer_phone_number?: string ):Promise<SearchResponse> => {
       const params = new URLSearchParams();

       if (customer_phone_number) params.append('phone', customer_phone_number);
       if (customer_email) params.append('email', customer_email);

      const url = `search/ticket?${params.toString()}`;
      const res = await axiosClient.get(url);
      return res.data;
  },

    /*--------------------------------------Get Detail Ticket----------------------------------------------------------- */
    GetDetailTicket:async(cart_id?: string):Promise<TicketDetailResponse> => {
      const url = `detail-ticket/ticket?cart_id=${cart_id}`;
      const res = await axiosClient.get(url);
      return res.data;
    }

}