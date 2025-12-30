import type { IApiResponse } from "../../Interface/IApiResponse";
import type { IApiResponsePagination } from "../../Interface/IApiResponsePagination";
import type { IGetAllNotificationsResponse } from "../../Interface/Notification/IGetAllNotifications";
import type { IGetNotificationResponse } from "../../Interface/Notification/IGetNotification";
import type { IMarkNotificationAsReadRequest, IMarkNotificationAsReadResponse } from "../../Interface/Notification/IMarkNotificationAsRead";
import axiosClient from "../Axios/axiosClient";

export const notification_api = {
  GetMyNotification: async (userId: string): Promise<IApiResponse<IGetNotificationResponse>> => {
    const url = `/notification/system/${userId}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  GetAllNotifications: async (
    userId: string,
    params: {
      isRead?: boolean,
      page?: number,
      size?: number,
      sort?: string
    } = {}
  ): Promise<IApiResponse<IApiResponsePagination<IGetAllNotificationsResponse>>> => {
    const {
      isRead,
      page = 0,
      size = 10,
      sort = 'deliveredAt,desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort,
      ...(typeof isRead === 'boolean' && { isRead: isRead.toString() }),
    });

    const url = `/notification/system-all/${userId}?${queryParams.toString()}`;
    const res = await axiosClient.get(url);
    return res.data;
  },

  MarkNotificationAsRead: async (userNotificationId: string, body: IMarkNotificationAsReadRequest): Promise<IApiResponse<IMarkNotificationAsReadResponse>> => {
    const url = `/notification/mark-read/${userNotificationId}`;
    const res = await axiosClient.patch(url, body);
    return res.data;
  }

}