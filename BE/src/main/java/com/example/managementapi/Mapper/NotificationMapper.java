package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Response.Notification.*;
import com.example.managementapi.Entity.Notifications;
import com.example.managementapi.Entity.UserNotifications;
import org.mapstruct.*;

import java.util.List;


@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(source = "notifications.notificationId", target = "notificationId")
    @Mapping(source = "userNotificationId", target = "userNotificationId")
    @Mapping(source = "notifications.title", target = "title")
    @Mapping(source = "notifications.message", target = "message")
    @Mapping(source = "notifications.type", target = "type")
    @Mapping(source = "isRead", target = "isRead")
    @Mapping(source = "notifications.createBy", target = "createBy")
    @Mapping(source = "notifications.createdAt", target = "createdAt")
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

        SendNotiToOneUserOrManyUserRes res = new SendNotiToOneUserOrManyUserRes();
        res.setNotificationId(notification.getNotificationId());

        if (userNotifications != null && !userNotifications.isEmpty()) {
            res.setResults(toUserNotiDetails(userNotifications));
        } else {
            res.setResults(List.of());
        }

        return res;
    }

    default SendNotiToAdminRes toSendNotiToAdminRes(
            Notifications notification,
            List<UserNotifications> userNotifications) {

        return SendNotiToAdminRes.builder()
                .notificationId(notification.getNotificationId())
                .results(userNotifications == null
                        ? List.of()
                        : toUserNotiDetails(userNotifications))
                .build();
    }




}
