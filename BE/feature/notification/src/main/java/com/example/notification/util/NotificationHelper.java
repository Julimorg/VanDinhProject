package com.example.notification.util;

import com.example.common.dto.notification.response.NotificationRes;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.notification.repository.NotificationsRepository;
import com.example.notification.repository.UserNotificationsRepository;
import com.example.persistence.entity.Notifications;
import com.example.persistence.entity.UserNotifications;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationHelper {

    private final SimpMessagingTemplate messagingTemplate;

    private final UserNotificationsRepository userNotiRepo;

    private final NotificationsRepository  notificationRepo;

    public UserNotifications findUserNotiOrThrow(String id) {
        return userNotiRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_FOUND));
    }

    public void sendToQueue(String socketId, NotificationRes payload) {
        String queue = "/queue/notifications-user" + socketId;
        messagingTemplate.convertAndSend(queue, payload);
    }

    public void sendUnreadCount(String userId, int unreadCount){
        log.info("Sending unread count to userId = [{}]", userId);
        messagingTemplate.convertAndSendToUser(userId, "/queue/unread-count", unreadCount);
    }

    public void sendToNotificationUser(String userId, NotificationRes payload){
        messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", payload);
    }


    public Notifications saveNotification(String title, String message,
                                           String type, String createdBy) {
        return notificationRepo.save(
                Notifications.builder()
                        .title(title)
                        .message(message)
                        .type(type)
                        .createBy(createdBy)
                        .build()
        );
    }

    public NotificationRes buildPayload(Notifications noti) {
        return NotificationRes.builder()
                .notificationId(noti.getNotificationId())
                .title(noti.getTitle())
                .message(noti.getMessage())
                .type(noti.getType())
                .createdAt(noti.getCreatedAt())
                .build();
    }

}
