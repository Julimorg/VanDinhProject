package com.example.managementapi.Dto.Response.Notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserNotiDetail {

    private String userId;

    private String userNotificationId;

    private String status;

    private String sendChannel;

    private Boolean isRead;

    private LocalDateTime deliveredAt;

}
