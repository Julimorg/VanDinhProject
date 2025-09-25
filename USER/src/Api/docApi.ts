import type { Login, LoginResponseTokenData } from '@/Interface/auth';
import axiosClient from './axiosClient';

import type { DevRegisterRequest, DevRegisterResposne } from '../Interface/TDevRegister';
import type { GetUserResponse } from '@/Interface/TGetUser';
import type {
  DeleteserviceRs,
  DetailService,
  ServiceCreate,
  TServiceListResponse,
} from '@/Interface/TServiceItems';
import type { LanguageResponse } from '@/Interface/TLanguage';
import type { EditDiscountService, DiscountServiceRs,CreateDiscountService, GetDiscountServiceResponse } from '@/Interface/TDiscountService';
import type { ChangePasswordPayload } from '@/Interface/ChangePassword';
import type { EditUserRequest } from '@/Interface/TEditUser';
import type {  ReceipterRequestExportExeilFile, ReceipterStatisticDetailResponse, ReceipterStatisticResponseData, StatisticRequestExportExelFile, StatisticResponse } from '@/Interface/TRevenue';
import type { SearchResponse } from '@/Interface/TSearchTicket';
import type { TransactionDetailResponse } from '@/Interface/TTransactionDetail';
import type { CodeRemoveRs, DiscountCodeRs, DiscountCodeUpdate } from '@/Interface/TDiscountCode';
import type { CreatePermission, CreatePermissionRs, Permission, UpdatePermissionPayload } from '@/Interface/TPermission';
import type { MomoResponse } from '@/Interface/TMomo';
export const docApi = {
  Login: async (body: Login): Promise<LoginResponseTokenData> => {
    const url = `/account/log-in`;
    const res = await axiosClient.post(url, body);
    return res.data;
  },

  /*--------------------------------------Get Language---------------------------------------------------------------- */
  getLanguage: async (): Promise<LanguageResponse> => {
    const url = `/language `;
    const res = await axiosClient.get<LanguageResponse>(url);
    return res.data;
  },

  /*--------------------------------------Fetch ticket service--------------------------------------------------------------- */
  FetchTicketService: async (): Promise<TServiceListResponse> => {
    const url = `/service-ticket`;
    const res = await axiosClient.get<TServiceListResponse>(url);
    return res.data;
  },

  /*--------------------------------------Create User Module--------------------------------------------------------------- */
  CreateUser: async (body: DevRegisterRequest): Promise<DevRegisterResposne> => {
    const url = '/account/register-receipter';
    const res = await axiosClient.post(url, body);
    return res.data;
  },

  /*--------------------------------------Get User Module--------------------------------------------------------------- */
  GetUser: async (): Promise<GetUserResponse> => {
    const url = '/user/all';
    const res = await axiosClient.get(url);
    return res.data;
  },

  /*--------------------------------------Get --------------------------------------------------------------- */
  getService: async (
    id: string,
    typeOfCustomer: string,
    is_Available: string,
    page: string,
    limit: string
  ): Promise<TServiceListResponse> => {
    const url = `/service/${id}?typeOfCustomer=${typeOfCustomer}&is_Available=${is_Available}&page=${page}&limit=${limit}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  /*--------------------------------------Detail Service --------------------------------------------------------------- */
  getDetailService: async (service_id: string): Promise<DetailService> => {
    const url = `service/detail/${service_id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  /*--------------------------------------Delete Service --------------------------------------------------------------- */

  deleteservice: async (service_id: string): Promise<DeleteserviceRs> => {
    const url = `service/delete/${service_id}`;
    const res = await axiosClient.patch(url);
    return res.data;
  },
  /*--------------------------------------update Service --------------------------------------------------------------- */
  updateService: async (service_id: string, data: FormData): Promise<DeleteserviceRs> => {
    const url = `service/update-service/${service_id}`;
    const res = await axiosClient.patch(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  /*--------------------------------------CreateService --------------------------------------------------------------- */

  createService: async (data: FormData): Promise<ServiceCreate> => {
    const url = `service/create-service`;
    const res = await axiosClient.post(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
   /*--------------------------------------createServiceDiscount --------------------------------------------------------------- */
createServiceDiscount:async(body:CreateDiscountService):Promise<DiscountServiceRs>=>{
 const url =`price/create-discount`
 const res = await axiosClient.post(url,body)
 return res.data
},


  /*--------------------------------------editServiceDiscount --------------------------------------------------------------- */
  editServiceDiscount: async (
    id: string,
    body: EditDiscountService
  ): Promise<DiscountServiceRs> => {
    const url = `price/edit/${id}`;
    const res = await axiosClient.patch(url, body);
    return res.data;
  },
 /*--------------------------------------getalldiscount service --------------------------------------------------------------- */
 getdiscountservice:async():Promise<GetDiscountServiceResponse>=>{
  const url =`price`
  const res= await axiosClient.get(url)
  return res.data

 },


//   /*--------------------------------------Get User By ID--------------------------------------------------------------- */
// GetUserById: async (id: string) => {
//   const allUsers = await axiosClient.get('/user/all');
//   const foundUser = allUsers.data.data.find((user: any) => user.id === id);
//   if (!foundUser) throw new Error('User not found');
//   return foundUser;
// }
// ,
  /*--------------------------------------Change Password--------------------------------------------------------------- */
  ChangePassword: async (payload: ChangePasswordPayload) => {
    const url = '/account/change-password';
    const res = await axiosClient.post(url, payload);
    return res.data;
  },
  /*--------------------------------------Reset Password--------------------------------------------------------------- */
  UpdateUser: async (id: string, payload: any) => {
    const res = await axiosClient.post(`/account/reset-password/${id}`, payload);
    return res.data;
  },

  /*--------------------------------------Edit User Profile Module--------------------------------------------------------------- */
  UpdateAdmin: async (body: EditUserRequest, id: string): Promise<void> => {
    const url = `/user/profile/${id}`;
    const res = await axiosClient.patch(url, body);
    return res.data;
  },
  /*--------------------------------------Search Ticket Module----------------------------------------------------------- */

  SearchTicket: async (
    customer_email?: string,
    customer_phone_number?: string
  ): Promise<SearchResponse> => {
    const params = new URLSearchParams();

    if (customer_phone_number) params.append('phone', customer_phone_number);
    if (customer_email) params.append('email', customer_email);

    const url = `search/ticket?${params.toString()}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  /*--------------------------------------Get Detail Ticket Module----------------------------------------------------------- */
  GetDetailTicket: async (cart_id?: string): Promise<TransactionDetailResponse> => {
    const url = `detail-ticket/ticket?cart_id=${cart_id}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  /*-------------------------------------- Revenue Statistic Module --------------------------------------------------------------- */
  StatisticRevenue: async (start_date: string, end_date: string): Promise<StatisticResponse> => {
    const url = `statistic/revenue?from=${start_date}&to=${end_date}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
  /*--------------------------------------Change User Status--------------------------------------------------------------- */
  ChangeUserStatus: async (id: string, isActive: boolean) => {
    const res = await axiosClient.patch(`/user/change-status/${id}`, { isActive });
    return res.data;
  },
/*--------------------------------------Get Discount Code--------------------------------------------------------------- */
getDiscountCode: async (params: { page: number; limit: number }): Promise<DiscountCodeRs> => {
  const { page, limit } = params;
  const url = `discountcode?page=${page}&limit=${limit}`;
  const res = await axiosClient.get(url);
  return res.data;
},
/*--------------------------------------Remove Discount Code--------------------------------------------------------------- */

removeDiscountCode : async(id:string):Promise<CodeRemoveRs>=>{
  const url =`discountcode/change/${id}`
  const res =await axiosClient.patch(url,id)
  return res.data
},
/*--------------------------------------Update Discount Code--------------------------------------------------------------- */
updateDiscountCode : async(id:string,body:DiscountCodeUpdate):Promise<CodeRemoveRs>=>{
  const url =`discountcode/${id}`
  const res = await axiosClient.patch(url,body)
  return res.data
},
createDiscountCode: async(body:DiscountCodeUpdate):Promise<CodeRemoveRs>=>{
  const url =`discountcode`
  const res =await axiosClient.post(url,body)
  return res.data
},

/*--------------------------------------Export Exel File Revenue Statistic Module--------------------------------------------------------------- */

ExportRevenueExcelFile: async(body: StatisticRequestExportExelFile): Promise<Blob> => {
  const url = 'excel/export';
  const res = await axiosClient.post(url, body, {responseType: "blob"});
  return res.data;
},
/*--------------------------------------Get all permission-------------------------------------------------------------- */

/*-------------------------------------- Receipter Statistic Module --------------------------------------------------------------- */
GetReceipterStatistic: async(start_date: string, end_date: string): Promise<ReceipterStatisticResponseData> => {
  const url = `statistic/over-all?from=${start_date}&to=${end_date}`;
  const res = await axiosClient.get(url);
  return res.data;
},
/*-------------------------------------- Receipter Statistic Detail Module--------------------------------------------------------------- */

GetReceipterStatisticDetail: async(user_id: string, start_date: string, end_date: string): Promise<ReceipterStatisticDetailResponse> => {
  const url = `statistic/detail/${user_id}?from=${start_date}&to=${end_date}`;
  const res = await axiosClient.get(url);
  return res.data;
},

/*-------------------------------------- Export Exel File Receipter Statistic Module --------------------------------------------------------------- */
ExportReceipterStatisticExcelFile: async(body: ReceipterRequestExportExeilFile): Promise<Blob> => {
  const url = `excel/export-receipter`;
  const res = await axiosClient.post(url, body, {responseType: "blob"});
  return res.data;
},

/*--------------------------------------Get Momo Module--------------------------------------------------------------- */
GetMomo: async(): Promise<MomoResponse> => {
  const url = '/momo';
  const res = await axiosClient.get(url);
  return res.data;
},
/*--------------------------------------Update Momo-------------------------------------------------------------- */
UpdateMomo: async (id: string, body: Partial<MomoResponse>): Promise<MomoResponse> => {
  const url = `/momo/${id}`;
  const res = await axiosClient.patch(url, body);
  return res.data;
},
/*--------------------------------------Add Momo-------------------------------------------------------------- */
AddMomo: async (id: string, body: Partial<MomoResponse>): Promise<MomoResponse> => {
  const url = `/momo/${id}`;
  const res = await axiosClient.post(url, body);
  return res.data;
},

/*--------------------------------------Get all permission-------------------------------------------------------------- */

getAllPermission:async():Promise<Permission[]>=>{
  const url =`permission/get-all`
  const res= await axiosClient.get(url)
  return res.data
},
/*--------------------------------------Createpermission-------------------------------------------------------------- */
createPermission:async(body:CreatePermission):Promise<CreatePermissionRs>=>{
  const url =`permission/create`
  const res = await axiosClient.post(url,body)
  return res.data
},

/*--------------------------------------Get permission by id -------------------------------------------------------------- */

getPermissonbyid :async(user_id:string):Promise<Permission[]>=>{
  const url =`/permission/${user_id}`
  const res = await axiosClient.get(url)
  return res.data
},
/*--------------------------------------update permission by id -------------------------------------------------------------- */
updatePermissionbyid: async(user_id:string,body:UpdatePermissionPayload):Promise<CreatePermissionRs>=>{
  const url =`permission/${user_id}`
  const res =await axiosClient.post(url,body)
  return res.data
},


};
