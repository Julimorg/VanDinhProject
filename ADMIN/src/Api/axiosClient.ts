import axios from 'axios';
import { useAuthStore } from '@/Store/auth';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // const res = error.response;

    
    if (
      typeof error?.message === 'string' &&
      error.message.includes('status code')
    ) {
      error.message = '';
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
