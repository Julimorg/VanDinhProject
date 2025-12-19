export type ISendNotificationsRequest = {
    userId: string[];
    title: string;
    message: string;
    type: string;
    createBy: string;
}

export type ISendNotificationsResponse = {
    notificationId: string;
    result: ISendNotificationsResult[];
}

export type ISendNotificationsResult = {
    userId: string;
    userNotificationId: string;
    status: string;
    sendChannel: string;
    isRead: boolean;
    deliveredAt: string;
}