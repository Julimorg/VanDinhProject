package com.example.notification.mapper;

import com.example.common.dto.notification.response.GetUserIsOnline;

import com.example.common.dto.notification.response.MarkNotificationAsReadRes;
import com.example.persistence.entity.User;
import com.example.persistence.entity.UserDevice;
import com.example.persistence.entity.UserNotifications;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserNotificationMapper {

    // ======================== GET ======================
    @Mapping(source = "user.id",        target = "userId")
    @Mapping(source = "user.userName",  target = "userName")
    @Mapping(source = "user.firstName", target = "firstName")
    @Mapping(source = "user.lastName",  target = "lastName")
    @Mapping(source = "user.email",     target = "email")
    @Mapping(source = "user.userImg",   target = "userImg")
    @Mapping(source = "isOnline",       target = "isOnline")
    @Mapping(target = "socketId",       ignore = true)
    @Mapping(target = "lastSeen",       ignore = true)
    GetUserIsOnline toGetUserIsOnline(User user, boolean isOnline);

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
