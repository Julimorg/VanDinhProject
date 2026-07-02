package com.example.common.interfaces.notifications;

import com.example.common.dto.notification.request.SendNotiToAdminReq;
import com.example.common.dto.notification.request.SendNotiToOneUserOrManyUserReq;
import com.example.common.dto.notification.response.*;
import com.example.persistence.entity.Notifications;
import com.example.persistence.entity.UserNotifications;
import com.example.persistence.enumTable.UserNotifactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationInterface {


    void notifyAdminsOrderConfirmed(String userId);

    Page<GetUserIsOnline> getUserOnline(Pageable pageable);

    List<GetSystemTopFiveNotifications> getSystemTopFiveNotifications(String userId);

    int getUnreadCount(String userId);

    Page<GetSystemAllNotificationsRes> getAllNotifications(String userId,
                                                           String isRead,
                                                           Pageable pageable);

    MarkNotificationAsReadRes markAsRead(String userNotificationId);

    SendNotiToOneUserOrManyUserRes sendToUsers(SendNotiToOneUserOrManyUserReq req);

    SendNotiToAdminRes sendToAdmins(SendNotiToAdminReq req);

    UserNotifications createAndSendNotification(String title,
                                                String message,
                                                String type,
                                                String createdBy,
                                                String targetUserId,
                                                UserNotifactionStatus defaultStatus);



}
