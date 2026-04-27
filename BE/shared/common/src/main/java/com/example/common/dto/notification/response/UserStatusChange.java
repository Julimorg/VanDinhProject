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
public class UserStatusChange {
    private String userId;
    private String socketId;
    private String status; 
    private LocalDateTime lastSeen;
    private LocalDateTime timestamp;
}
