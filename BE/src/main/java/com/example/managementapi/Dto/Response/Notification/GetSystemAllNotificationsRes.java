package com.example.managementapi.Dto.Response.Notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetSystemAllNotificationsRes {
    private String notificationId;
    private String userNotificationId;
    private String title;
    private String message;
    private String type;
    private String createBy;
    private Boolean isRead;
    private LocalDateTime readAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime clickedAt;
    private LocalDateTime createdAt;
}
