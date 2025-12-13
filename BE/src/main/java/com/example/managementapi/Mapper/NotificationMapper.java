package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Response.Notification.GetSystemTopFiveNotifications;
import com.example.managementapi.Dto.Response.Notification.SendNotiToOneUserOrManyUserRes;
import com.example.managementapi.Dto.Response.Notification.UserNotiDetail;
import com.example.managementapi.Entity.Notifications;
import com.example.managementapi.Entity.UserNotifications;
import org.mapstruct.*;

import java.util.List;


@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(source = "notifications.notificationId", target = "notificationId")
    @Mapping(source = "notifications.title", target = "title")
    @Mapping(source = "notifications.message", target = "message")
    @Mapping(source = "notifications.type", target = "type")
    @Mapping(source = "notifications.createBy", target = "createBy")
    @Mapping(source = "notifications.createdAt", target = "createdAt")
    @Mapping(source = "isRead", target = "isRead")
    @Mapping(source = "userNotificationId", target = "userNotificationId")
    GetSystemTopFiveNotifications toGetSystemTopFiveNotifications(UserNotifications entity);


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



}
