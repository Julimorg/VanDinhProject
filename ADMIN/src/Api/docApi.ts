
import axiosClient from './axiosClient';
import { ILoginRequest, ILoginResponse } from '@/Interface/Auth/ILogin';
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
import { IGetAllSupplierResponse } from '@/Interface/Supplier/IGetAllSuppliers';
import { buildFormData } from '@/Utils/ulti';
import { ICreateSupplierRequest, ICreateSupplierResponse } from '@/Interface/Supplier/ICreateSupplier';
import { ICreateCategoryRequest, ICreateCategoryResponse } from '@/Interface/Category/ICreateCategory';
import { IGetAllCategoryResponse } from '@/Interface/Category/IGetAllCategories';
import { IUpdateSupplierRequest, IUpdateSupplierResponse } from '@/Interface/Supplier/IUpdateSupplier';
import { IGetCategoryDetailResponse } from '@/Interface/Category/IGetCategoryDetail';
import { IUpdateCategoryRequest, IUpdateCategoryResponse } from '@/Interface/Category/IUpdateCategory';
import { IGetAllProductResponse } from '@/Interface/Product/IGetAllProducts';
import { IGetProductDetailResponse } from '@/Interface/Product/IGetProductsDetail';
import { IGetSupplierSelectionResponse } from '@/Interface/Supplier/IGetSupplierSelection';
import { IGetCategorySelectionResponse } from '@/Interface/Category/IGetCategorySelection';
import { IGetColorSelectionResponse } from '@/Interface/Color/IGetColorSelection';
import { ICreateProductRequest, ICreateProductResponse } from '@/Interface/Product/ICreateProduct';
import { IUpdateProductRequest, IUpdateProductResponse } from '@/Interface/Product/IUpdateProduct';
import { IGetAllColor } from '@/Interface/Color/IGetAllColor';
import { ICreateColorRequest, ICreateColorResponse } from '@/Interface/Color/ICreateColor';
import { IUpdateColorRequest, IUpdateColorResponse } from '@/Interface/Color/IUpdateColor';
import { IGetProductSelectionResponse } from '@/Interface/Product/IGetProductSelection';
import { IGetUserSelectionResponse } from '@/Interface/Users/IGetUserSelection';
import { ICreateOrderRequest, ICreateOrderResponse } from '@/Interface/Order/ICreateOrder';
import { IGetAllOrderResponse } from '@/Interface/Order/IGetAllOrderResponse';
import { IUpdateOrderRequest, IUpdateOrderResponse } from '@/Interface/Order/IUpdateOrder';
import { IGetOrderDetailResponse } from '@/Interface/Order/IGetOrderDetail';
import { IUpdateOrderItemRequest, IUpdateOrderItemResponse } from '@/Interface/Order/IUpdateOrderItem';
import { IApproveOrderStatusRequest, IApproveOrderStatusResponse } from '@/Interface/Order/IApproveOrderStatus';
import { IUserOrderResponse } from '@/Interface/Order/IUserOrder';
import { IExportExcelFileRequest } from '@/Interface/File/IExportExcelFile';
import { IGetNotificationResponse } from '@/Interface/Notification/IGetNotification';
import { IGetAllNotifications } from '@/Interface/Notification/IGetAllNotification';


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

  GetMyProfile: async (userId: string): Promise<IApiResponse<IGetMyProfileResponse>> => {
    const url = `/users/view-profile/${userId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetUserDetail: async (userId: string): Promise<IApiResponse<IGetUserDetailResponse>> => {
    const url = `/users/get-profile/${userId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  DeleteUser: async (userId: string): Promise<IApiResponse<void>> => {
    const url = `/users/delete-user/${userId}`
    const res = await axiosClient.delete(url);
    return res.data;
  },

  UpdateMyProfile: async (
    body: IUdpateMyProfileRequest,
    userId: string
  ): Promise<IApiResponse<IUpdateMyProfileResponse>> => {
    const url = `/users/update-profile/${userId}`;
    const formData = buildFormData(body);

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

  CreateUser: async (body: ICreateUserRequest,): Promise<IApiResponse<ICreateUserResponse>> => {
    const url = `/users/create-staff`;
    
    const formData = buildFormData(body);

    const res = await axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });

    return res.data;
  },

  UpdateUser: async (body: IUpdateUserRequest, userId: string): Promise<IApiResponse<IUpdateUserResponse>> => {
    const url = `/users/update-user/${userId}`;

    const formData = buildFormData(body);

    const res = await axiosClient.patch(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });

    return res.data;
  },

  GetUserSelection: async (): Promise<IApiResponse<IGetUserSelectionResponse>> => {
    const url = `/users/select-users`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  //* ======================================================== Supplier  ======================================================== */

  GetSupplierSelection: async (): Promise<IApiResponse<IGetSupplierSelectionResponse>> => {
    const url = `/supplier/select-suppliers`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetAllSupplier: async (
    params: {
      keyword?: string,
      page?: number,
      size?: number,
      sort?: string,
    } = {}
  ): Promise<IApiResponse<IApiResponsePagination<IGetAllSupplierResponse>>> => {
    const { keyword, page = 1, size = 5, sort = 'createAt, desc' } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      ...(keyword && { keyword }),
    });

    const url = `/supplier/get-suppliers?${queryParams.toString()}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  DeleteSupplier: async (supplierId: string): Promise<IApiResponse<void>> => {
    const url = `/supplier/delete-supplier/${supplierId}`
    const res = await axiosClient.delete(url);
    return res.data;
  },

  CreateSupplier: async (body: ICreateSupplierRequest): Promise<IApiResponse<ICreateSupplierResponse>> => {
    const url = `/supplier/create-supplier`
    const formData = buildFormData(body);
    const res = await axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });

    return res.data;
  },

  UpdateSupplier: async (supplierId: string, body: IUpdateSupplierRequest): Promise<IApiResponse<IUpdateSupplierResponse>> => {
    const url = `/supplier/update-supplier/${supplierId}`;
    const formData = buildFormData(body);
    const res = await axiosClient.patch(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });

    return res.data;
  },

  //* ======================================================== Category  ======================================================== */

  GetCategorySelection: async (): Promise<IApiResponse<IGetCategorySelectionResponse>> => {
    const url = `/categories/select-categories`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetAllCategory: async (
    params: {
      page?: number,
      size?: number,
      sort?: string
      keyword?: string
    } = {}
  ): Promise<IApiResponse<IApiResponsePagination<IGetAllCategoryResponse>>> => {
    const { keyword, page = 1, size = 5, sort = 'createAt, desc' } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      ...(keyword && { keyword }),
    })

    const url = `/categories/get-categories?${queryParams.toString()}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  CreateCategory: async (body: ICreateCategoryRequest,): Promise<IApiResponse<ICreateCategoryResponse>> => {
    const url = `/categories/create-category`;
    const formData = new FormData();

    if (body.categoryName !== undefined) formData.append('categoryName', body.categoryName);
    if (body.categoryDescription !== undefined) formData.append('categoryDescription', body.categoryDescription);
    if (body.categoryImage instanceof File) formData.append('categoryImage', body.categoryImage);

    const res = await axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });

    return res.data;
  },

  GetCategoryDetail: async (categoryId: string): Promise<IApiResponse<IGetCategoryDetailResponse>> => {
    const url = `/categories/detail-category/${categoryId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  UpdateCategory: async (body: IUpdateCategoryRequest, categoryId: string): Promise<IApiResponse<IUpdateCategoryResponse>> => {
    const url = `/categories/update/${categoryId}`;
    const formData = buildFormData(body);
    const res = await axiosClient.patch(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });

    return res.data;
  },

  DeleteCategory: async (categoryId: string): Promise<IApiResponse<void>> => {
    const url = `/categories/delete/${categoryId}`
    const res = await axiosClient.delete(url);
    return res.data;
  },

  //* ======================================================== Color  ======================================================== */

  GetAllColor: async (
    params: {
      supplierName?: string,
      keyword?: string,
      page?: number,
      size?: number,
      sort?: string,
    } = {}
  ): Promise<IApiResponse<IApiResponsePagination<IGetAllColor>>> => {

    const {
      supplierName,
      keyword,
      page = 1,
      size = 5,
      sort = 'createAt, desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      ...(keyword && { keyword }),
      ...(supplierName && { supplierName })
    })

    const url = `/color/get-color?${queryParams.toString()}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  CreateColor: async (body: ICreateColorRequest): Promise<IApiResponse<ICreateColorResponse>> => {
    const url = `/color/create-color`;
    const formData = buildFormData(body);
    const res = await axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });

    return res.data;
  },

  GetColorSelection: async (supplierId: string): Promise<IApiResponse<IGetColorSelectionResponse>> => {
    const url = `/color/color-selector/${supplierId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  UpdateColor: async (colorId: string, body: IUpdateColorRequest): Promise<IApiResponse<IUpdateColorResponse>> => {
    const url = `/color/edit-color/${colorId}`;
    const formData = buildFormData(body);
    const res = await axiosClient.patch(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });
    return res.data;
  },

  DeleteColor: async (colorId: string): Promise<IApiResponse<void>> => {
    const url = `/color/delete-color/${colorId}`;
    const res = await axiosClient.delete(url);
    return res.data;
  },

  //* ======================================================== Product  ======================================================== */

  GetAllProducts: async (
    params: {
      keyword?: string,
      categoryName?: string,
      supplierName?: string,
      minPrice?: number,
      maxPrice?: number,
      page?: number,
      size?: number,
      sort?: string
    } = {}
  ): Promise<IApiResponse<IApiResponsePagination<IGetAllProductResponse>>> => {

    const {
      keyword,
      categoryName,
      supplierName,
      minPrice,
      maxPrice,
      page = 1,
      size = 5,
      sort = 'createAt,desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      ...(keyword && { keyword }),
      ...(categoryName && { categoryName }),
      ...(supplierName && { supplierName }),
      ...(typeof minPrice === 'number' && !isNaN(minPrice) && { minPrice: minPrice.toString() }),
      ...(typeof maxPrice === 'number' && !isNaN(maxPrice) && { maxPrice: maxPrice.toString() }),

    })
    const url = `/products/get-products?${queryParams.toString()}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetProducDetail: async (productId: string): Promise<IApiResponse<IGetProductDetailResponse>> => {
    const url = `/products/detail-product/${productId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  CreateProduct: async (body: ICreateProductRequest): Promise<IApiResponse<ICreateProductResponse>> => {
    const url = `/products/create-product`;
    const formData = buildFormData(body);
    const res = await axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });

    return res.data;
  },

  DeleteProduct: async (productId: string): Promise<IApiResponse<void>> => {
    const url = `/products/delete/${productId}`;
    const res = await axiosClient.delete(url);
    return res.data;
  },

  UpdateProduct: async (productId: string, body: IUpdateProductRequest): Promise<IApiResponse<IUpdateProductResponse>> => {
    const url = `/products/update/${productId}`;
    const formData = buildFormData(body);
    const res = await axiosClient.patch(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });

    return res.data;
  },

  GetProductSelection: async (
    params: {
      keyword?: string,
      categoryName?: string,
      supplierName?: string,
      minPrice?: number,
      maxPrice?: number,
    } = {}
  ): Promise<IApiResponse<IGetProductSelectionResponse>> => {

    const {
      keyword,
      categoryName,
      supplierName,
      minPrice,
      maxPrice,
    } = params;

    const queryParams = new URLSearchParams({
      ...(keyword && { keyword }),
      ...(categoryName && { categoryName }),
      ...(supplierName && { supplierName }),
      ...(typeof minPrice === 'number' && !isNaN(minPrice) && { minPrice: minPrice.toString() }),
      ...(typeof maxPrice === 'number' && !isNaN(maxPrice) && { maxPrice: maxPrice.toString() }),

    })
    const url = `/products/select-products?${queryParams.toString()}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  //* ======================================================== Order  ======================================================== */
  
  GetUserListOrder: async (
        userId: string,
        params: {
            keyword?: string,
            status?: string,
            page?: number,
            size?: number,
            sort?: string,
        } = {}
    ): Promise<IApiResponse<IApiResponsePagination<IUserOrderResponse>>> => {
        const { keyword, status, page = 1, size = 5, sort = 'createAt, desc' } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort,
            ...(keyword && { keyword }),
            ...(status && { status }),
        });

        const url = `/order/list-orders/${userId}?${queryParams.toString()}`;
        const res = await axiosClient.get(url);
        return res.data;
    },
  
  CreateOrder: async (userId: string, body: ICreateOrderRequest): Promise<IApiResponse<ICreateOrderResponse>> => {
    const url = `/order/create-order/${userId}`;
    const res = await axiosClient.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  },

  UpdateOrder: async (orderId: string, body: IUpdateOrderRequest): Promise<IApiResponse<IUpdateOrderResponse>> => {
    const url = `/order/admin/update/${orderId}`;
    const res = await axiosClient.patch(url, body, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  },

  ///approve-order/{userId}/{orderId}
  ApproveOrder: async (userId: string, orderId: string, body: IApproveOrderStatusRequest): Promise<IApiResponse<IApproveOrderStatusResponse>> => {
    const url = `/order/approve-order/${userId}/${orderId}`;
    const res = await axiosClient.patch(url, body, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return res.data;
  },

  UpdateOrderItem: async (orderId: string, body: IUpdateOrderItemRequest): Promise<IApiResponse<IUpdateOrderItemResponse>> => {
    const url = `/order/admin/update-order-item/${orderId}`;
    const res = await axiosClient.patch(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  },

  GetAllOrder: async (
    params: {
      keyword?: string,
      status?: string,
      page?: number,
      size?: number,
      sort?: string,
    } = {}
  ): Promise<IApiResponse<IApiResponsePagination<IGetAllOrderResponse>>> => {
    const { keyword, status, page = 1, size = 5, sort = 'createAt, desc' } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      ...(keyword && { keyword }),
      ...(status && { status }), 
    });

    const url = `/order/user-order?${queryParams.toString()}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  DeleteOrder: async (orderId: string): Promise<IApiResponse<void>> => {
    const url = `/order/delete/${orderId}`;
    const res = await axiosClient.delete(url);
    return res.data;
  },

  GetOrderDetail: async (orderId: string): Promise<IApiResponse<IGetOrderDetailResponse>> => {
    const url = `/order/order-detail/${orderId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

   //* ======================================================== Notification  ======================================================== */
   
   GetAllNotifications: async(
      userId: string,
      params: 
      {
        page?: number,
        size?: number,
        sort?: string,
      } = {}
    ): Promise<IApiResponse<IApiResponsePagination<IGetAllNotifications>>> => {
      const { page = 1, size = 5, sort = 'deliveredAt, desc' } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort,
      });

      const url = `/notification/system-all/${userId}?${queryParams.toString()}`;
      const res = await axiosClient.get(url);
      return res.data;
   },


   GetMyNotification: async (userId: string): Promise<IApiResponse<IGetNotificationResponse>> => {
    const url = `/notification/system/${userId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  MarkAllNotificationsAsRead: async (userId: string): Promise<IApiResponse<void>> => {
    const url = `/notifications/mark-all-read/${userId}`;
    const res = await axiosClient.patch(url);
    return res.data;
  },

  //* ======================================================== Export Excel  ======================================================== */

  ExportUsersExcel: async (body: IExportExcelFileRequest): Promise<Blob> => {
    const url = `/file/excel-file`;
    const res = await axiosClient.post(url, body, {
      responseType: 'blob',
    });
    return res.data;
  },

  

}