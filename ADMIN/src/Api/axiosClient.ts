import axios from 'axios';
import { docApi } from './docApi';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/Store/IAuth';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//? Config timeout cho request
axiosClient.defaults.timeout = 1000 * 60 * 10;

//? Tạo 1 promise cho việc gọi api refresh_token
//? Tại sao? -> Mục đích là tạo 1 promise này để khi nhận yêu cầu refreshToken đầu tiên
//? hold lại việc gọi API refresh_token cho tới khi xong xuôi thì mới retry lại những api bị lỗi trước đó
//? thay vì cứ để gọi lại refresh_token leein tục tới mỗi request lỗi
let refreshTokenPromise: Promise<string | null> | null = null;

//? Config request xuống server
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers && config.url !== '/auth/refresh-token') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log('Request config:', { url: config.url, headers: config.headers });
    return config;
  },
  (error) => {
    // console.error('Request error:', error);
    return Promise.reject(error);
  }
);

//? Config resposne từ server
axiosClient.interceptors.response.use(
  (response) => response,
  
  async (error) => {
    const originalRequest = error.config;

    //? Bỏ qua interceptor cho yêu cầu refresh token
    if (originalRequest.url === '/auth/refresh-token') {
      // console.log('Bỏ qua interceptor cho yêu cầu refresh token');
      return Promise.reject(error);
    }

    //? Xử lý lỗi 401 hoặc 410
    if (
      (error.response?.status === 401 || error.response?.status === 410) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshTokenPromise) {
          // console.log('Bắt đầu refresh token...');
          const refreshToken = useAuthStore.getState().refreshToken;

          if (!refreshToken) {
            // console.error('Không có refresh token để gửi yêu cầu');
            // throw new Error('Không có refresh token');
          }

          refreshTokenPromise = docApi
            .RefreshToken()
            .then((res) => {
              const { accessToken } = res.data;
              // console.log('Refresh token thành công, access_token mới:', access_token);

              useAuthStore.getState().setTokens(
                accessToken,
                refreshToken,
                useAuthStore.getState().email,
                useAuthStore.getState().id,
                useAuthStore.getState().userName,
                useAuthStore.getState().userImg
              );
              axiosClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
              return accessToken;
            })
            .catch((refreshError) => {
              console.error('Lỗi khi refresh token:', {
                message: refreshError.message,
                response: refreshError.response?.data,
                status: refreshError.response?.status,
              });
              useAuthStore.getState().clearTokens();
              window.location.href = '/login';
              return null;
            })
            .finally(() => {
              // console.log('Reset refreshTokenPromise');
              refreshTokenPromise = null;
            });
        }

        const newAccessToken = await refreshTokenPromise;
        if (!newAccessToken) {
          // throw new Error('Không thể lấy access token mới');
        }

        // console.log('Retry request gốc với access_token mới:', newAccessToken, originalRequest.url);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        // console.error('Lỗi khi xử lý refresh token:', err);
        return Promise.reject(err);
      }
    }

    const errorMessage =
      error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
    // console.error('Response error:', { message: errorMessage, status: error.response?.status });
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default axiosClient;