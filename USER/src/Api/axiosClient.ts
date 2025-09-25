import { useAuthStore } from '@/Store/auth';
import axios from 'axios';
import type { AxiosResponse } from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://zen-api.stlsolution.com/api/v1',

  headers: {
    'Content-Type': 'application/json',
  },
});

// bắt response từ api
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // console.log('Response:', response.data);
    return response;
  },
  // (error) => {
  //   console.error('API Error:', error);
  //   return Promise.reject(error);
  // }
);

axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
