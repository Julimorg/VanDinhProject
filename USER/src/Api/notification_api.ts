import type { IApiResponse } from "../Interface/IApiResponse";
import type { IApiResponsePagination } from "../Interface/IApiResponsePagination";
import type { IGetAllNotificationsResponse } from "../Interface/Notification/IGetAllNotifications";
import type { IGetNotificationResponse } from "../Interface/Notification/IGetNotification";
import axiosClient from "./axiosClient";

export const notification_api = {
  GetMyNotification: async (userId: string): Promise<IApiResponse<IGetNotificationResponse>> => {
    const url = `/notification/system/${userId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetAllNotifications: async(userId: string): Promise<IApiResponse<IApiResponsePagination<IGetAllNotificationsResponse>>> => {
    const url = `/notification/system-all/${userId}`;
    const res = await axiosClient.get(url);
    return res.data;
  }

}