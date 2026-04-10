package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Response.Notification.GetSystemAllNotificationsRes;
import com.example.managementapi.Dto.Response.Notification.GetSystemTopFiveNotifications;
import com.example.managementapi.Dto.Response.Notification.UserNotiDetail;
import com.example.managementapi.Entity.Notifications;
import com.example.managementapi.Entity.UserNotifications;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-10T10:06:47+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class NotificationMapperImpl implements NotificationMapper {

    @Override
    public GetSystemTopFiveNotifications toGetSystemTopFiveNotifications(UserNotifications entity) {
        if ( entity == null ) {
            return null;
        }

        GetSystemTopFiveNotifications.GetSystemTopFiveNotificationsBuilder getSystemTopFiveNotifications = GetSystemTopFiveNotifications.builder();

        getSystemTopFiveNotifications.notificationId( entityNotificationsNotificationId( entity ) );
        getSystemTopFiveNotifications.userNotificationId( entity.getUserNotificationId() );
        getSystemTopFiveNotifications.title( entityNotificationsTitle( entity ) );
        getSystemTopFiveNotifications.message( entityNotificationsMessage( entity ) );
        getSystemTopFiveNotifications.type( entityNotificationsType( entity ) );
        getSystemTopFiveNotifications.isRead( entity.getIsRead() );
        getSystemTopFiveNotifications.createBy( entityNotificationsCreateBy( entity ) );
        getSystemTopFiveNotifications.createdAt( entityNotificationsCreatedAt( entity ) );

        return getSystemTopFiveNotifications.build();
    }

    @Override
    public GetSystemAllNotificationsRes toGetSystemAllNotificationsRes(UserNotifications entity) {
        if ( entity == null ) {
            return null;
        }

        GetSystemAllNotificationsRes.GetSystemAllNotificationsResBuilder getSystemAllNotificationsRes = GetSystemAllNotificationsRes.builder();

        getSystemAllNotificationsRes.notificationId( entityNotificationsNotificationId( entity ) );
        getSystemAllNotificationsRes.userNotificationId( entity.getUserNotificationId() );
        getSystemAllNotificationsRes.title( entityNotificationsTitle( entity ) );
        getSystemAllNotificationsRes.message( entityNotificationsMessage( entity ) );
        getSystemAllNotificationsRes.type( entityNotificationsType( entity ) );
        getSystemAllNotificationsRes.isRead( entity.getIsRead() );
        getSystemAllNotificationsRes.createBy( entityNotificationsCreateBy( entity ) );
        getSystemAllNotificationsRes.createdAt( entityNotificationsCreatedAt( entity ) );
        getSystemAllNotificationsRes.deliveredAt( entity.getDeliveredAt() );
        getSystemAllNotificationsRes.clickedAt( entity.getClickedAt() );
        getSystemAllNotificationsRes.readAt( entity.getReadAt() );

        return getSystemAllNotificationsRes.build();
    }

    @Override
    public List<UserNotiDetail> toUserNotiDetails(List<UserNotifications> userNotifications) {
        if ( userNotifications == null ) {
            return null;
        }

        List<UserNotiDetail> list = new ArrayList<UserNotiDetail>( userNotifications.size() );
        for ( UserNotifications userNotifications1 : userNotifications ) {
            list.add( userNotificationsToUserNotiDetail( userNotifications1 ) );
        }

        return list;
    }

    private String entityNotificationsNotificationId(UserNotifications userNotifications) {
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

    private String entityNotificationsTitle(UserNotifications userNotifications) {
        if ( userNotifications == null ) {
            return null;
        }
        Notifications notifications = userNotifications.getNotifications();
        if ( notifications == null ) {
            return null;
        }
        String title = notifications.getTitle();
        if ( title == null ) {
            return null;
        }
        return title;
    }

    private String entityNotificationsMessage(UserNotifications userNotifications) {
        if ( userNotifications == null ) {
            return null;
        }
        Notifications notifications = userNotifications.getNotifications();
        if ( notifications == null ) {
            return null;
        }
        String message = notifications.getMessage();
        if ( message == null ) {
            return null;
        }
        return message;
    }

    private String entityNotificationsType(UserNotifications userNotifications) {
        if ( userNotifications == null ) {
            return null;
        }
        Notifications notifications = userNotifications.getNotifications();
        if ( notifications == null ) {
            return null;
        }
        String type = notifications.getType();
        if ( type == null ) {
            return null;
        }
        return type;
    }

    private String entityNotificationsCreateBy(UserNotifications userNotifications) {
        if ( userNotifications == null ) {
            return null;
        }
        Notifications notifications = userNotifications.getNotifications();
        if ( notifications == null ) {
            return null;
        }
        String createBy = notifications.getCreateBy();
        if ( createBy == null ) {
            return null;
        }
        return createBy;
    }

    private LocalDateTime entityNotificationsCreatedAt(UserNotifications userNotifications) {
        if ( userNotifications == null ) {
            return null;
        }
        Notifications notifications = userNotifications.getNotifications();
        if ( notifications == null ) {
            return null;
        }
        LocalDateTime createdAt = notifications.getCreatedAt();
        if ( createdAt == null ) {
            return null;
        }
        return createdAt;
    }

    protected UserNotiDetail userNotificationsToUserNotiDetail(UserNotifications userNotifications) {
        if ( userNotifications == null ) {
            return null;
        }

        UserNotiDetail.UserNotiDetailBuilder userNotiDetail = UserNotiDetail.builder();

        userNotiDetail.deliveredAt( userNotifications.getDeliveredAt() );
        userNotiDetail.isRead( userNotifications.getIsRead() );
        if ( userNotifications.getSendChannel() != null ) {
            userNotiDetail.sendChannel( userNotifications.getSendChannel().name() );
        }
        if ( userNotifications.getStatus() != null ) {
            userNotiDetail.status( userNotifications.getStatus().name() );
        }
        userNotiDetail.userId( userNotifications.getUserId() );
        userNotiDetail.userNotificationId( userNotifications.getUserNotificationId() );

        return userNotiDetail.build();
    }
}
