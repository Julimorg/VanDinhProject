package com.example.managementapi.Events;

import com.example.managementapi.Dto.Response.Notification.GetUserIsOnline;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class UserOnlineStatusChangeEvent extends ApplicationEvent {
    
    private final GetUserIsOnline userOnlineStatus;
    
    public UserOnlineStatusChangeEvent(Object source, GetUserIsOnline userOnlineStatus) {
        super(source);
        this.userOnlineStatus = userOnlineStatus;
    }
}

