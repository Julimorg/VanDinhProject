export type IMarkNotificationAsReadResponse = {
    notificationId: string;
    userNotificationId: string;
    isRead: boolean;
    clickedAt: string;
    readAt: string;
}

export type IMarkNotificationAsReadRequest = {
    isRead: boolean;
}