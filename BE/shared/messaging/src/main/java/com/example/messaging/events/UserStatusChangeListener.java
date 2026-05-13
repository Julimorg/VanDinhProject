package com.example.messaging.events;

import com.example.messaging.dto.UserStatusPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserStatusChangeListener {

    private final SimpMessagingTemplate messagingTemplate;

    private UserStatusPayload buildPayload(UserOnlineStatusChangeEvent event) {
        return UserStatusPayload.builder()
                .userId(event.getUserId())
                .online(event.isOnline())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Async
    @EventListener
    public void handleUserOnlineStatusChange(UserOnlineStatusChangeEvent event) {
        log.info("Broadcasting status change – userId=[{}] online=[{}]",
                event.getUserId(), event.isOnline());

        try {
            messagingTemplate.convertAndSend("/topic/user-status", buildPayload(event));
            log.info("Broadcasted to /topic/user-status for user [{}]", event.getUserId());

        } catch (Exception e) {
            // Log và bỏ qua — status change không phải critical operation
            // Retry nên dùng @RetryableTopic (Kafka) hoặc scheduled job nếu thực sự cần
            log.error("Failed to broadcast status for user [{}]: {}",
                    event.getUserId(), e.getMessage(), e);
        }
    }

}
