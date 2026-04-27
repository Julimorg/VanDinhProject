package com.example.messaging.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatusPayload {

    private String userId;
    private boolean online;
    private LocalDateTime timestamp;

}
