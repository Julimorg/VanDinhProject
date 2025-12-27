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
public class NotificationRes {
    private String userNotificationId;
    private String notificationId;
    private String title;
    private String message;
    private String type;
    private LocalDateTime createdAt;
}
