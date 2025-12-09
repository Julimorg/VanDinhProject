package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Response.Notification.SendNotiToOneUserOrManyUserRes;
import com.example.managementapi.Dto.Response.Notification.UserNotiDetail;
import com.example.managementapi.Entity.Notifications;
import com.example.managementapi.Entity.UserNotifications;
import org.mapstruct.*;

import java.util.List;


@Mapper(componentModel = "spring")
public interface NotificationMapper {


    @Mapping(target = "results", ignore = true)  // QUAN TRỌNG NHẤT!
    SendNotiToOneUserOrManyUserRes toSendNotiRes(Notifications notifications);

    // Map 1 UserNotifications → UserNotiDetail
    @Mapping(target = "status", source = "status")
    @Mapping(target = "sendChannel", source = "sendChannel")
    UserNotiDetail toUserNotiDetail(UserNotifications userNotifications);

    // Map danh sách
    List<UserNotiDetail> toUserNotiDetails(List<UserNotifications> userNotifications);

    // Phương thức chính: gộp tất cả
    @AfterMapping
    default void setResults(@MappingTarget SendNotiToOneUserOrManyUserRes res,
                            Notifications noti,
                            @Context List<UserNotifications> userNotis) {
        if (userNotis != null && !userNotis.isEmpty()) {
            res.setResults(toUserNotiDetails(userNotis));
        }
    }

    // Phương thức chính bạn sẽ gọi trong Service
    default SendNotiToOneUserOrManyUserRes toFullResponse(
            Notifications notifications,
            List<UserNotifications> userNotifications) {

        SendNotiToOneUserOrManyUserRes res = toSendNotiRes(notifications);
        setResults(res, notifications, userNotifications); // gọi @AfterMapping
        return res;
    }
}
