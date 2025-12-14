export type IGetAllNotifications = {
    notificationId: string;
    userNotificationId: string;
    title: string;
    message: string;
    type: string;
    createBy: string;
    isRead: boolean;
    createdAt: string;
    readAt: string;
    deliveredAt: string;
    clickedAt: string;
}