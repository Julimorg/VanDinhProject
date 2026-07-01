package com.example.common.dto.notification.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetSystemTopFiveNotifications {
    private String notificationId;
    private String userNotificationId;
    private String title;
    private String message;
    private String type;
    private String createBy;
    private Boolean isRead;
    private LocalDateTime createAt;
}
