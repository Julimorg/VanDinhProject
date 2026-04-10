package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Notification.MarkNotificationAsReadReq;
import com.example.managementapi.Dto.Response.Notification.GetUserIsOnline;
import com.example.managementapi.Dto.Response.Notification.MarkNotificationAsClickedRes;
import com.example.managementapi.Dto.Response.Notification.MarkNotificationAsReadRes;
import com.example.managementapi.Dto.Response.Notification.NotificationRes;
import com.example.managementapi.Dto.Response.Notification.UserNotiDetail;
import com.example.managementapi.Entity.Notifications;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Entity.UserDevice;
import com.example.managementapi.Entity.UserNotifications;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-10T10:06:49+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class UserNotificationMapperImpl implements UserNotificationMapper {

    @Override
    public UserNotiDetail toUserNotiDetail(UserNotifications userNotifications) {
        if ( userNotifications == null ) {
            return null;
        }

        UserNotiDetail.UserNotiDetailBuilder userNotiDetail = UserNotiDetail.builder();

        if ( userNotifications.getStatus() != null ) {
            userNotiDetail.status( userNotifications.getStatus().name() );
        }
        if ( userNotifications.getSendChannel() != null ) {
            userNotiDetail.sendChannel( userNotifications.getSendChannel().name() );
        }
        userNotiDetail.userNotificationId( userNotifications.getUserNotificationId() );
        userNotiDetail.userId( userNotifications.getUserId() );
        userNotiDetail.isRead( userNotifications.getIsRead() );
        userNotiDetail.deliveredAt( userNotifications.getDeliveredAt() );

        return userNotiDetail.build();
    }

    @Override
    public NotificationRes toUserNotification(UserNotifications userNotifications) {
        if ( userNotifications == null ) {
            return null;
        }

        NotificationRes.NotificationResBuilder notificationRes = NotificationRes.builder();

        notificationRes.userNotificationId( userNotifications.getUserNotificationId() );

        return notificationRes.build();
    }

    @Override
    public void markNotificationAsRead(UserNotifications userNotifications, MarkNotificationAsReadReq request) {
        if ( request == null ) {
            return;
        }
    }

    @Override
    public MarkNotificationAsReadRes toMarkNotificationAsReadRes(UserNotifications userNotifications) {
        if ( userNotifications == null ) {
            return null;
        }

        MarkNotificationAsReadRes.MarkNotificationAsReadResBuilder markNotificationAsReadRes = MarkNotificationAsReadRes.builder();

        markNotificationAsReadRes.notificationId( userNotificationsNotificationsNotificationId( userNotifications ) );
        markNotificationAsReadRes.clickedAt( userNotifications.getClickedAt() );
        markNotificationAsReadRes.readAt( userNotifications.getReadAt() );
        markNotificationAsReadRes.isRead( userNotifications.getIsRead() );
        markNotificationAsReadRes.userNotificationId( userNotifications.getUserNotificationId() );

        return markNotificationAsReadRes.build();
    }

    @Override
    public MarkNotificationAsClickedRes toMarkNotificationAsClickedRes(UserNotifications userNotifications) {
        if ( userNotifications == null ) {
            return null;
        }

        MarkNotificationAsClickedRes.MarkNotificationAsClickedResBuilder markNotificationAsClickedRes = MarkNotificationAsClickedRes.builder();

        markNotificationAsClickedRes.notificationId( userNotificationsNotificationsNotificationId( userNotifications ) );
        markNotificationAsClickedRes.clickedAt( userNotifications.getClickedAt() );
        markNotificationAsClickedRes.readAt( userNotifications.getReadAt() );
        markNotificationAsClickedRes.isRead( userNotifications.getIsRead() );
        markNotificationAsClickedRes.userNotificationId( userNotifications.getUserNotificationId() );

        return markNotificationAsClickedRes.build();
    }

    @Override
    public GetUserIsOnline toGetUserOnline(User user, UserDevice device) {
        if ( user == null && device == null ) {
            return null;
        }

        GetUserIsOnline.GetUserIsOnlineBuilder getUserIsOnline = GetUserIsOnline.builder();

        if ( user != null ) {
            getUserIsOnline.userId( user.getId() );
            getUserIsOnline.userName( user.getUserName() );
            getUserIsOnline.firstName( user.getFirstName() );
            getUserIsOnline.lastName( user.getLastName() );
            getUserIsOnline.email( user.getEmail() );
            getUserIsOnline.userImg( user.getUserImg() );
        }
        if ( device != null ) {
            getUserIsOnline.socketId( device.getSocketId() );
            getUserIsOnline.lastSeen( device.getLastSeen() );
        }

        return getUserIsOnline.build();
    }

    private String userNotificationsNotificationsNotificationId(UserNotifications userNotifications) {
        if ( userNotifications == null ) {
            return null;
        }
        Notifications notifications = userNotifications.getNotifications();
        if ( notifications == null ) {
            return null;
        }
        String notificationId = notifications.getNotificationId();
        if ( notificationId == null ) {
            return null;
        }
        return notificationId;
    }
}
