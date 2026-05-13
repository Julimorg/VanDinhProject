package com.example.notification.service;
import com.example.common.dto.notification.request.SendNotiToAdminReq;
import com.example.common.dto.notification.request.SendNotiToOneUserOrManyUserReq;
import com.example.common.dto.notification.response.*;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.user.UserInternalService;
import com.example.common.interfaces.user.UserPresenceInternalService;
import com.example.notification.mapper.NotificationMapper;
import com.example.notification.mapper.UserNotificationMapper;
import com.example.notification.repository.NotificationsRepository;
import com.example.notification.repository.UserDeviceRepository;
import com.example.notification.repository.UserNotificationsRepository;
import com.example.notification.util.NotificationHelper;
import com.example.persistence.entity.Notifications;
import com.example.persistence.entity.User;
import com.example.persistence.entity.UserNotifications;
import com.example.persistence.enumTable.Status;
import com.example.persistence.enumTable.UserNotifactionSendChannel;
import com.example.persistence.enumTable.UserNotifactionStatus;
import com.example.persistence.enumTable.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationsRepository notiRepo;

    private final UserDeviceRepository deviceRepo;

    private final UserNotificationsRepository userNotiRepo;

    private final NotificationMapper notificationMapper;

    private final UserNotificationMapper userNotificationMapper;

    private final UserInternalService userInternalService;

    private final UserPresenceInternalService  userPresenceInternalService;

    private final SimpMessagingTemplate messagingTemplate;

    private final NotificationHelper notificationHelper;


    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public Page<GetUserIsOnline> getUserOnline(Pageable pageable) {
        return userInternalService.getAllUsers(pageable)
                .map(user -> userNotificationMapper.toGetUserIsOnline(
                        user,
                        userPresenceInternalService.isOnline(user.getId())
                ));
    }

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_ADMIN','ROLE_STAFF')")
    public List<GetSystemTopFiveNotifications> getSystemTopFiveNotifications(String userId) {
        userInternalService.validateUserExists(userId);

        return userNotiRepo.findTop5ByUserIdOrderByDeliveredAtDesc(userId)
                .stream()
                .map(notificationMapper::toGetSystemTopFiveNotifications)
                .toList();
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF','ROLE_USER')")
    public int getUnreadCount(String userId) {
        userInternalService.validateUserExists(userId);
        return userNotiRepo.countByUserIdAndIsReadFalse(userId);
    }

    public Page<GetSystemAllNotificationsRes> getAllNotifications(String userId,
                                                                  String isRead,
                                                                  Pageable pageable) {
        userInternalService.validateUserExists(userId);

        if (!StringUtils.hasText(isRead)) {
            return userNotiRepo.findAllByUserId(userId, pageable)
                    .map(notificationMapper::toGetSystemAllNotificationsRes);
        }

        return userNotiRepo.findAllByUserIdAndIsRead(userId, Boolean.valueOf(isRead), pageable)
                .map(notificationMapper::toGetSystemAllNotificationsRes);
    }

    public MarkNotificationAsReadRes markAsRead(String userNotificationId) {
        UserNotifications un = notificationHelper.findUserNotiOrThrow(userNotificationId);

        // Idempotent — chỉ update nếu chưa read
        if (!un.getIsRead()) {
            un.setIsRead(true);
            un.setReadAt(LocalDateTime.now());
            userNotiRepo.save(un);
        }

        return userNotificationMapper.toMarkNotificationAsReadRes(un);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_STAFF')")
    public SendNotiToOneUserOrManyUserRes sendToUsers(SendNotiToOneUserOrManyUserReq req) {

        if (req.getUserId() == null || req.getUserId().isEmpty()) {
            throw new AppException(ErrorCode.USER_ID_REQUIRED);
        }

        Notifications noti = notificationHelper.saveNotification(
                req.getTitle(),
                req.getMessage(),
                req.getType(), UserRole.ADMIN.toString());

        List<UserNotifications> saved = req.getUserId().stream()
                .map(userId -> buildAndSend(noti, userId, UserNotifactionStatus.PENDING))
                .toList();

        userNotiRepo.saveAll(saved);

        return notificationMapper.toSendNotiResponse(noti, saved);
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    public SendNotiToAdminRes sendToAdmins(SendNotiToAdminReq req) {
        if (!StringUtils.hasText(req.getTitle()) || !StringUtils.hasText(req.getMessage())) {
            throw new AppException(ErrorCode.NOTIFICATION_CONTENT_REQUIRED);
        }

        Notifications noti = notificationHelper.saveNotification(
                req.getTitle(),
                req.getMessage(),
                req.getType(),
                req.getCreateBy()
        );

        List<String> targetIds = (req.getUserId() != null && !req.getUserId().isEmpty())
                ? req.getUserId()
                : userInternalService
                .findAllByRoles_NameIn(List.of(
                        UserRole.ADMIN.toString(),
                        UserRole.STAFF.toString()
                ))
                .stream()
                .map(User::getId)
                .toList();

        List<UserNotifications> saved = targetIds.stream()
                .map(adminId -> buildAndSend(noti, adminId, UserNotifactionStatus.PENDING))
                .toList();

        userNotiRepo.saveAll(saved);

        return notificationMapper.toSendNotiToAdminRes(noti, saved);
    }

    private UserNotifications buildAndSend(Notifications noti,
                                           String targetUserId,
                                           UserNotifactionStatus defaultStatus) {
        UserNotifications un = UserNotifications.builder()
                .notifications(noti)
                .userId(targetUserId)
                .isRead(false)
                .status(defaultStatus)
                .sendChannel(UserNotifactionSendChannel.WEB)
                .build();

        userPresenceInternalService.getSocketId(targetUserId)
                .ifPresentOrElse(
                        socketId -> {
                            un.setStatus(UserNotifactionStatus.DELIVERED);
                            un.setDeliveredAt(LocalDateTime.now());
                            notificationHelper
                                    .sendToQueue(socketId,
                                            notificationHelper.buildPayload(noti));
                            log.info("Realtime notification sent to user [{}]", targetUserId);
                        },
                        () -> log.info("User [{}] OFFLINE – notification saved to DB", targetUserId)
                );

        return un;
    }
}
