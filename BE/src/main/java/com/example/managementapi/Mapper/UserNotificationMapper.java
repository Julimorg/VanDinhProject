package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Response.Notification.NotificationRes;
import com.example.managementapi.Dto.Response.Notification.UserNotiDetail;
import com.example.managementapi.Entity.UserNotifications;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

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
}
