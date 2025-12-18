import type { IApiResponse } from "../Interface/IApiResponse";
import type { IGetNotificationResponse } from "../Interface/Notification/IGetNotification";
import axiosClient from "./axiosClient";

export const notification_api = {
    GetMyNotification: async (userId: string): Promise<IApiResponse<IGetNotificationResponse>> => {
    const url = `/notification/system/${userId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },
}