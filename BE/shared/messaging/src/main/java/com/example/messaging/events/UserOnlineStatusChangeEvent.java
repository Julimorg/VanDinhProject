package com.example.messaging.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class UserOnlineStatusChangeEvent extends ApplicationEvent {
    private final  String userId;
    private final boolean online;

    public UserOnlineStatusChangeEvent(Object source,
                                       String userId,
                                       Boolean online) {
        super(source);
        this.userId = userId;
        this.online = online;
    }
}
