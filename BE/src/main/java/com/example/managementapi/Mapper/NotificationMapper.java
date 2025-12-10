package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Response.Notification.SendNotiToOneUserOrManyUserRes;
import com.example.managementapi.Dto.Response.Notification.UserNotiDetail;
import com.example.managementapi.Entity.Notifications;
import com.example.managementapi.Entity.UserNotifications;
import org.mapstruct.*;

import java.util.List;


@Mapper(componentModel = "spring", uses = UserNotificationMapper.class)
public interface NotificationMapper {


    List<UserNotiDetail> toUserNotiDetails(List<UserNotifications> userNotifications);

    // Method chính – SIÊU SẠCH, KHÔNG CẦN GÌ THÊM
    default SendNotiToOneUserOrManyUserRes toSendNotiResponse(
            Notifications notification,
            List<UserNotifications> userNotifications) {

        SendNotiToOneUserOrManyUserRes res = new SendNotiToOneUserOrManyUserRes();
        res.setNotificationId(notification.getNotificationId());

        if (userNotifications != null && !userNotifications.isEmpty()) {
            res.setResults(toUserNotiDetails(userNotifications)); // MapStruct tự hiểu!
        } else {
            res.setResults(List.of());
        }

        return res;
    }


}
