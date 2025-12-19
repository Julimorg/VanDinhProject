package com.example.managementapi.Dto.Request.Notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarkNotificationAsReadReq {
    private Boolean isRead;

    private LocalDateTime readAt;

    private LocalDateTime clickedAt;
}
