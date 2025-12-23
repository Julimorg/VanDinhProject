package com.example.managementapi.Events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.time.LocalDateTime;

@Getter
public class UserStatusChangeEvent extends ApplicationEvent {

    private final String userId;
    private final String socketId;
    private final String status;
    private final LocalDateTime lastSeen;

    public UserStatusChangeEvent(Object source, String userId, String socketId, String status, LocalDateTime lastSeen) {
        super(source);
        this.userId = userId;
        this.socketId = socketId;
        this.status = status;
        this.lastSeen = lastSeen;
    }
}
