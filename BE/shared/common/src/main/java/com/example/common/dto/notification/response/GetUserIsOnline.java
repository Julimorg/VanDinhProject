package com.example.common.dto.notification.response;

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
public class GetUserIsOnline {
    private String userId;
    private String userName;
    private String firstName;
    private String lastName;
    private String email;
    private String userImg;
    private String socketId;
    private boolean isOnline;
    private LocalDateTime lastSeen;
}
