import type { Login, LoginResponseTokenData } from '@/Interface/auth';
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


export const docApi = {
  Login: async (body: Login): Promise<LoginResponseTokenData> => {
        const url = `/account/log-in`
        const res = await axiosClient.post(url, body)
        return res.data
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