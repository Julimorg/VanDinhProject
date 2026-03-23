import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { AWS_API, LOCAL_API } from '../../Utils/env_dev_handler';
import { useAuthStore } from '../../Middleware/useAuthStoreWithLocal';
import { auth_api_handler } from '../Api_Handler/auth_api';
import { toast } from 'react-toastify';


interface QueueItem {
  resolve: (value: string | null) => void;
  reject: (reason: Error) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ErrorResponse {
  message?: string;
  [key: string]: unknown;
}

// ============================================
// AXIOS INSTANCE
// ============================================
const axiosClient = axios.create({
  baseURL: LOCAL_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.defaults.timeout = 1000 * 60 * 10;

// ============================================
// REFRESH TOKEN QUEUE
// ============================================
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ============================================
// REQUEST INTERCEPTOR
// ============================================
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;

    const publicEndpoints = [
      '/api/v1/auth/log-in',
      '/auth/sign-up',
      '/auth/refresh-token',
      '/auth/forgot-password',
      '/reset-pass',
    ];

    const isPublic = publicEndpoints.some((path) => config.url?.includes(path));

    if (token && !isPublic && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
axiosClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    //? Xử lý lỗi refresh token endpoint
    if (originalRequest.url?.includes('/auth/refresh-token')) {
      console.log('Refresh token API failed, clearing tokens');
      useAuthStore.getState().clearTokens();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    //? Xử lý lỗi 401/410 - cần refresh token
    if (
      (error.response?.status === 401 || error.response?.status === 410) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      //? Nếu đang refresh, đưa request vào queue
      if (isRefreshing) {
        console.log(' Already refreshing, adding to queue. Queue size:', failedQueue.length + 1);
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (!token) {
              throw new Error('No token received from queue');
            }
            console.log(' Queue processed, retrying request:', originalRequest.url);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err: Error) => Promise.reject(err));
      }

      isRefreshing = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        console.error('Không có refresh token');
        isRefreshing = false;
        processQueue(new Error('Không có refresh token'), null);
        useAuthStore.getState().clearTokens();
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        return Promise.reject(error);
      }

      try {
        console.log('Bắt đầu refresh token...');

        const res = await auth_api_handler.RefreshToken();
        const { accessToken } = res.data;

        console.log('Refresh token thành công, new AT:', accessToken?.substring(0, 20) + '...');

        const { 
          refreshToken: currentRefreshToken, 
          userName, 
          email, 
          userImg, 
          id 
        } = useAuthStore.getState();

        useAuthStore.getState().setTokens(
          accessToken,
          currentRefreshToken,
          userName,
          email ?? null,
          userImg ?? null,
          id
        );

        axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        console.log(' Processing queue:', failedQueue.length, 'requests');
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        console.log(' Retrying original request:', originalRequest.url);

        console.log('Debug state:', {
          status: error.response?.status,
          url: originalRequest.url,
          isRefreshing,
          queueSize: failedQueue.length,
          hasRetried: originalRequest._retry,
          currentAT: useAuthStore.getState().accessToken?.substring(0, 20),
          currentRT: useAuthStore.getState().refreshToken?.substring(0, 20),
        });

        return axiosClient(originalRequest);
      } catch (refreshError) {
        const err = refreshError as AxiosError<ErrorResponse>;
        
        console.error('Lỗi khi refresh token:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });

        processQueue(new Error('Refresh token failed'), null);
        useAuthStore.getState().clearTokens();
        toast.error('Không thể làm mới phiên đăng nhập. Vui lòng đăng nhập lại!');

        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        console.log(' Reset isRefreshing flag');
        isRefreshing = false;
      }
    }

  
    const errorMessage =
      error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
    
    console.error('Response error:', {
      message: errorMessage,
      status: error.response?.status,
      url: originalRequest?.url,
    });

    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default axiosClient;