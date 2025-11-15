import type { ILoginRequest, ILoginResponse } from "../Interface/Auth/ILogin";
import type { ILogOutRequest } from "../Interface/Auth/ILogOut";
import type { IRefreshTokenResponse } from "../Interface/Auth/IRefreshToken";
import type { IRegisterRequest, IRegisterResponse } from "../Interface/Auth/IRegister";
import type { IApiResponse } from "../Interface/IApiResponse";
import { useAuthStoreCookiesStorage } from "../Middleware/useAuthStore";
import axiosClient from "./axiosClient";

export const auth_api_handler = {
    Login: async(body: ILoginRequest): Promise<IApiResponse<ILoginResponse>> => {
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
        const refreshToken = useAuthStoreCookiesStorage.getState().refreshToken;

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

    register: async (body: IRegisterRequest): Promise<IApiResponse<IRegisterResponse>> => {
        const url = `/auth/sign-up`;
        const res = await axiosClient.post(url, body, {
        headers: { 'Content-Type': 'application/json' },
        });

        return res.data;
    },

    verifyEmail: async (email: string): Promise<IApiResponse<void>> => {
        const url = `/reset-pass/verify-email/${email}`;
        const res = await axiosClient.post(url);
        return res.data;
    },

    verifyOtp: async (email: string, otp: number): Promise<IApiResponse<void>> => {
        const url = `/reset-pass/verify-otp/${email}`;
        const res = await axiosClient.post(url, { otp });
        return res.data;
    },

    changePassword: async (email: string, body: { password: string; newPassword: string }): Promise<IApiResponse<void>> => {
        const url = `/reset-pass/change-password/${email}`;
        const res = await axiosClient.patch(url, body);
        return res.data;
    },
}