package com.example.managementapi.Service;


import com.example.managementapi.Dto.Request.Notification.SendNotiToOneUserOrManyUserReq;
import com.example.managementapi.Dto.Response.Notification.NotificationRes;
import com.example.managementapi.Dto.Response.Notification.SendNotiToOneUserOrManyUserRes;
import com.example.managementapi.Dto.Response.Notification.UserNotiDetail;
import com.example.managementapi.Entity.Notifications;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Entity.UserNotifications;
import com.example.managementapi.Enum.UserNotifactionSendChannel;
import com.example.managementapi.Enum.UserNotifactionStatus;
import com.example.managementapi.Mapper.NotificationMapper;
import com.example.managementapi.Repository.NotificationsRepository;
import com.example.managementapi.Repository.UserDeviceRepository;
import com.example.managementapi.Repository.UserNotificationsRepository;
import com.example.managementapi.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    private final UserRepository userRepository;

    private final NotificationsRepository notiRepo;

    private final UserDeviceRepository deviceRepo;

    private final UserNotificationsRepository userNotiRepo;

    private final NotificationMapper notificationMapper;


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public SendNotiToOneUserOrManyUserRes sendToOneUserOrManyUser(SendNotiToOneUserOrManyUserReq req){

        if (req.getUserId() == null || req.getUserId().isEmpty()) throw new RuntimeException("User id is null");

        Notifications noti = notiRepo.save(Notifications.builder()
                .title(req.getTitle())
                .message(req.getMessage())
                .type(req.getType())
                .createBy("ADMIN")
                .build());

        List<UserNotifications> savedUserNotis = new ArrayList<>();

        for(String userId : req.getUserId()){
            UserNotifications un = UserNotifications.builder()
                    .notifications(noti)
                    .userId(userId)
                    .isRead(false)
                    .status(UserNotifactionStatus.PENDING)
                    .sendChannel(UserNotifactionSendChannel.WEB)
                    .build();


            boolean isOnline = deviceRepo
                    .findFirstByUserIdAndSocketIdIsNotNull(userId)
                    .isPresent();

            if(isOnline){

                NotificationRes payload = NotificationRes.builder()
                        .notificationId(noti.getNotificationId())
                        .title(noti.getTitle())
                        .message(noti.getMessage())
                        .type(noti.getType())
                        .createdAt(noti.getCreatedAt())
                        .build();

                messagingTemplate.convertAndSendToUser(
                        userId,
                        "/queue/notifications",
                        payload
                );
                un.setStatus(UserNotifactionStatus.DELIVERED);
                un.setDeliveredAt(LocalDateTime.now());
                log.info("Realtime sent to user {} (online)", userId);
            } else {
                un.setStatus(UserNotifactionStatus.PENDING);
                log.info("User {} is OFFLINE – notification saved to DB, will see when login", userId);
            }

            userNotiRepo.save(un);

        }

        userNotiRepo.saveAll(savedUserNotis);

        List<UserNotiDetail> details = savedUserNotis.stream()
                .map(un -> UserNotiDetail.builder()
                        .userId(un.getUserId())
                        .userNotificationId(un.getUserNotificationId())
                        .status(un.getStatus().name())
                        .sendChannel(un.getSendChannel().name())
                        .isRead(un.getIsRead())
                        .deliveredAt(un.getDeliveredAt())
                        .build())
                .toList();

        return SendNotiToOneUserOrManyUserRes.builder()
                .notificationId(noti.getNotificationId())
                .results(details)
                .build();
    }

    // Gửi thông báo riêng cho 1 user (dùng userId làm principal name)
    public void sendToUser(String userId, NotificationRes notification) {
        messagingTemplate.convertAndSendToUser(
                userId,                              // Spring sẽ tự thêm prefix /user/
                "/queue/notifications",              // → client nhận ở /user/{userId}/queue/notifications
                notification
        );
    }

    // Gửi broadcast cho tất cả user đang online
    public void sendToAll(NotificationRes notification) {
        messagingTemplate.convertAndSend("/topic/public-notifications", notification);
    }

    // Gửi chỉ cho admin (nếu cần)
    public void sendToAdmins(NotificationRes notification) {
        messagingTemplate.convertAndSend("/topic/admin-broadcast", notification);
    }
}
