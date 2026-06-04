import axios from 'axios';
import { docApi } from './docApi';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/Store/IAuth';
import {  PUBLIC_API } from '@/Utils/env_dev_handler';

const axiosClient = axios.create({
  baseURL: PUBLIC_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.defaults.timeout = 1000 * 60 * 10;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    const publicEndpoints = [
      '/auth/log-in',
      '/auth/sign-up',
      '/auth/refresh-token',
      '/auth/forgot-password',
      '/reset-pass',
    ];

    const isPublic = publicEndpoints.some((path) =>
      config.url?.includes(path)
    );

    if (token && !isPublic && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  
  async (error) => {
    
    const originalRequest = error.config;

    if (originalRequest.url?.includes('/auth/refresh-token')) {
      // console.log('Refresh token API failed, clearing tokens');
      useAuthStore.getState().clearTokens();
      // window.location.href = '/login';
      return Promise.reject(error);
    }

    if (
      (error.response?.status === 401 || error.response?.status === 410) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      //? Nếu đang refresh, đưa request vào queue và chờ
      if (isRefreshing) {
        // console.log('Already refreshing, adding to queue. Queue size:', failedQueue.length + 1);
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // console.log('Queue processed, retrying request:', originalRequest.url);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        // console.error('Không có refresh token');
        isRefreshing = false;
        processQueue(new Error('Không có refresh token'), null);
        useAuthStore.getState().clearTokens();
        return Promise.reject(error);
      }

      try {
        // console.log('Bắt đầu refresh token...');
        
        const res = await docApi.RefreshToken();
        const { accessToken } = res.data; 
        
        // console.log(' Refresh token thành công, new AT:', accessToken?.substring(0, 20) + '...');

        const { refreshToken: currentRefreshToken, userName, email, userImg, id } = useAuthStore.getState();
        

        useAuthStore.getState().setTokens(
          accessToken,
          currentRefreshToken, 
          userName,
          email ?? null,
          userImg ?? null,
          id
        );

        axiosClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
        
        // console.log('Processing queue:', failedQueue.length, 'requests');
       
        processQueue(null, accessToken);
        
       
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        // console.log('Retrying original request:', originalRequest.url);
       
        // console.log('Debug state:', {
        //   status: error.response?.status,
        //   url: originalRequest.url,
        //   isRefreshing,
        //   queueSize: failedQueue.length,
        //   hasRetried: originalRequest._retry,
        //   currentAT: useAuthStore.getState().accessToken?.substring(0, 20),
        //   currentRT: useAuthStore.getState().refreshToken?.substring(0, 20)
        // });

        return axiosClient(originalRequest);
        
        
      } catch (refreshError: any) {
        // console.error('Lỗi khi refresh token:', {
        //   message: refreshError.message,
        //   status: refreshError.response?.status,
        //   data: refreshError.response?.data
        // });
        
        processQueue(refreshError, null);
        useAuthStore.getState().clearTokens();
        
        // window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        console.log(' Reset isRefreshing flag');
        isRefreshing = false;
      }
    }

    const errorMessage =
      error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
      console.error('Response error:', { message: errorMessage, status: error.response?.status });
      toast.error(errorMessage);
      return Promise.reject(error);
    
  }
  
);

export default axiosClient;