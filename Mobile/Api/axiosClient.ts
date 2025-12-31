
import axios from 'axios';
import Toast from 'react-native-toast-message';
// import { API_URL } from '@/Utils/env_handler';


const axiosClient = axios.create({
  baseURL: "http://192.168.1.14:8080/api/v1",
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosClient.interceptors.response.use(
  (response) => {
  
    return response;
  },
  (error) => {
    let message = 'Đã có lỗi xảy ra, vui lòng thử lại!';

    if (error.response) {
     
      const status = error.response.status;

      switch (status) {
        case 400:
          message = 'Yêu cầu không hợp lệ!';
          break;
        case 401:
          message = 'Không được phép truy cập!';
          break;
        case 403:
          message = 'Bạn không có quyền thực hiện hành động này!';
          break;
        case 404:
          message = 'Không tìm thấy tài nguyên!';
          break;
        case 500:
          message = 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau!';
          break;
        case 502:
        case 503:
        case 504:
          message = 'Máy chủ đang bảo trì hoặc quá tải!';
          break;
        default:
          message = error.response.data?.message || `Lỗi ${status}`;
      }
    } else if (error.request) {

      message = 'Không thể kết nối đến máy chủ. Kiểm tra kết nối mạng!';
    } else {

      message = 'Lỗi cấu hình yêu cầu!';
    }


    Toast.show({
      type: 'error',
      text1: 'Lỗi',
      text2: message,
      visibilityTime: 4000,
      position: 'bottom',
    });


    return Promise.reject(error);
  }
);

export default axiosClient;