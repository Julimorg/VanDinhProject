package com.example.notification.mapper;
import com.example.common.dto.notification.response.*;
import com.example.persistence.entity.Notifications;
import com.example.persistence.entity.UserNotifications;
import org.mapstruct.*;

import java.util.List;


@Mapper(
        componentModel = "spring",
        nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT
)
public interface NotificationMapper {

    // ======================== GET ======================

    @Mapping(source = "notifications.notificationId", target = "notificationId")
    @Mapping(source = "userNotificationId", target = "userNotificationId")
    @Mapping(source = "notifications.title", target = "title")
    @Mapping(source = "notifications.message", target = "message")
    @Mapping(source = "notifications.type", target = "type")
    @Mapping(source = "isRead", target = "isRead")
    @Mapping(source = "notifications.createBy", target = "createBy")
    @Mapping(source = "notifications.createdAt", target = "createAt")
    GetSystemTopFiveNotifications toGetSystemTopFiveNotifications(UserNotifications entity);

    @Mapping(source = "notifications.notificationId", target = "notificationId")
    @Mapping(source = "userNotificationId", target = "userNotificationId")
    @Mapping(source = "notifications.title", target = "title")
    @Mapping(source = "notifications.message", target = "message")
    @Mapping(source = "notifications.type", target = "type")
    @Mapping(source = "isRead", target = "isRead")
    @Mapping(source = "notifications.createBy", target = "createBy")
    @Mapping(source = "notifications.createdAt", target = "createdAt")
    @Mapping(source = "deliveredAt", target = "deliveredAt")
    @Mapping(source = "clickedAt", target = "clickedAt")
    @Mapping(source = "readAt", target = "readAt")
    GetSystemAllNotificationsRes toGetSystemAllNotificationsRes(UserNotifications entity);

    List<UserNotiDetail> toUserNotiDetails(List<UserNotifications> userNotifications);

    default SendNotiToOneUserOrManyUserRes toSendNotiResponse(
            Notifications notification,
            List<UserNotifications> userNotifications) {

        return SendNotiToOneUserOrManyUserRes.builder()
                .notificationId(notification.getNotificationId())
                .results(toUserNotiDetails(userNotifications))
                .build();
    }

    default SendNotiToAdminRes toSendNotiToAdminRes(
            Notifications notification,
            List<UserNotifications> userNotifications) {

        return SendNotiToAdminRes.builder()
                .notificationId(notification.getNotificationId())
                .results(toUserNotiDetails(userNotifications))
                .build();
    }



}
