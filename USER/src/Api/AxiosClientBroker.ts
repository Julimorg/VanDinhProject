import axios from "axios";

// const API_URL_BROKER = import.meta.env.VITE_BASE_URL_BROKER_DEV;

const AxiosClientBroker = axios.create({
  baseURL: 'https://broker.stlsolution.com',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// axiosClient.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   async (err: any) => {
//     const originalConfig = err.config;
//     // console.log("resfetching token");

//     if (originalConfig.url !== "/auth/login" && err.response) {
//       console.log(err.response, !originalConfig._retry);
//       // Access Token was expired
//       if (err.response.status === 401 && !originalConfig._retry) {
//         originalConfig._retry = true;
//         try {
//           const localRefreshToken = sessionStorage.getItem("refreshToken");
//           const localAccessToken = sessionStorage.getItem("accessToken");

//           if (localRefreshToken && localAccessToken) {
//             const data = {
//               refreshToken: localRefreshToken,
//               accessToken: localAccessToken,
//             };

//             const res = await AuthHRM.refreshTokenApi(data);
//             if (res.data && res.data?.accessToken && res.data?.refreshToken) {
//               console.log("RefreshToken", res.data);
//               AuthStore.getState().refreshTokenFn(res.data);
//             }
//           }

//           return axiosClient(originalConfig);
//         } catch (_error) {
//           console.log("refreshTokenError", _error);
//           AuthStore.getState().logOut();
//           return Promise.reject(_error);
//         }
//       }
//     }
//     // console.log('end refresh');
//     // console.log('ERROR RESPONSE:', err.response);
//     const { data, status } = err.response;
//     console.log("ERROR RESPONSE:", data);

//     if (status === 403) {
//       ForbiddenStore.getState().setForbidden(true);
//       return Promise.reject({ data, status });
//     }
//     return Promise.reject(data);
//   }
// );

// axiosClient.interceptors.request.use(
//   (config: any) => {
//     const accessToken = sessionStorage.getItem("accessToken");

//     // console.log('axiosClient.interceptors.request', accessToken);
//     if (accessToken) {
//       config.headers = {
//         Authorization: `Bearer ${accessToken}`,
//       };
//     }
//     return config;
//   },
//   (error) => {
//     console.log("ERROR RESPONSE:", error.response);
//     return Promise.reject(error);
//   }
// );

export default AxiosClientBroker;
