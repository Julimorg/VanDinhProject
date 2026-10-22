import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { PUBLIC_API } from '../../Utils/env_dev_handler';
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
  baseURL: PUBLIC_API,
  // Bat buoc de trinh duyet gui/nhan cookie httpOnly (access_token/refresh_token) -
  // BE da cho phep qua CORS allowCredentials + danh sach origin cu the (khong dung "*").
  withCredentials: true,
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
      useAuthStore.getState().clearAuth();
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
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (!token) {
              throw new Error('No token received from queue');
            }
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err: Error) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Refresh token la cookie httpOnly - trinh duyet tu gui kem, khong can
        // FE doc/truyen gi them (xem auth_api.ts RefreshToken).
        const res = await auth_api_handler.RefreshToken();
        const { accessToken } = res.data;

        const { userName, email, userImg, id } = useAuthStore.getState();

        useAuthStore.getState().setAuth(
          accessToken,
          userName,
          email ?? null,
          userImg ?? null,
          id
        );

        axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(new Error('Refresh token failed'), null);
        useAuthStore.getState().clearAuth();
        toast.error('Không thể làm mới phiên đăng nhập. Vui lòng đăng nhập lại!');

        window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

  
    const errorMessage =
      error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';

    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default axiosClient;