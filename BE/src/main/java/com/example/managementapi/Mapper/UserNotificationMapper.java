package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Notification.MarkNotificationAsReadReq;
import com.example.managementapi.Dto.Response.Notification.MarkNotificationAsClickedRes;
import com.example.managementapi.Dto.Response.Notification.MarkNotificationAsReadRes;
import com.example.managementapi.Dto.Response.Notification.NotificationRes;
import com.example.managementapi.Dto.Response.Notification.UserNotiDetail;
import com.example.managementapi.Entity.UserNotifications;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserNotificationMapper {

    @Mapping(target = "status", source = "status")
    @Mapping(target = "sendChannel", source = "sendChannel")
    @Mapping(target = "userNotificationId", source = "userNotificationId")
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "isRead", source = "isRead")
    @Mapping(target = "deliveredAt", source = "deliveredAt")
    UserNotiDetail toUserNotiDetail(UserNotifications userNotifications);

    NotificationRes toUserNotification(UserNotifications userNotifications);

    @Mapping(target = "isRead", ignore = true)
    @Mapping(target = "readAt", ignore = true)
    void markNotificationAsRead(@MappingTarget UserNotifications userNotifications, MarkNotificationAsReadReq request);

    @Mapping(source = "notifications.notificationId", target = "notificationId")
    @Mapping(source = "clickedAt", target = "clickedAt")
    @Mapping(source = "readAt", target = "readAt")
    @Mapping(source = "isRead", target = "isRead")
    MarkNotificationAsReadRes toMarkNotificationAsReadRes(UserNotifications userNotifications);

    @Mapping(source = "notifications.notificationId", target = "notificationId")
    @Mapping(source = "clickedAt", target = "clickedAt")
    @Mapping(source = "readAt", target = "readAt")
    @Mapping(source = "isRead", target = "isRead")
    MarkNotificationAsClickedRes toMarkNotificationAsClickedRes(UserNotifications userNotifications);
}
