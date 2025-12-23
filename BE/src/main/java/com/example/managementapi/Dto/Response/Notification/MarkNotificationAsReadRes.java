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
public class MarkNotificationAsReadRes {
    private String notificationId;
    private String userNotificationId;
    private Boolean isRead;
    private LocalDateTime clickedAt;
    private LocalDateTime readAt;
}
