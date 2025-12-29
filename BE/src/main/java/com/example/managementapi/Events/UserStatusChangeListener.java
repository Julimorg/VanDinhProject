package com.example.managementapi.Events;

import com.example.managementapi.Dto.Response.Notification.GetUserIsOnline;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class UserStatusChangeListener {
    
    private final SimpMessagingTemplate messagingTemplate;

//    @Async
    @EventListener
    public void handleUserOnlineStatusChange(UserOnlineStatusChangeEvent event) {
        GetUserIsOnline userOnlineStatus = event.getUserOnlineStatus();

        log.info(" Broadcasting user online status change: userId={}, socketId={}",
                userOnlineStatus.getUserId(), userOnlineStatus.getSocketId());

        try {
            // Gửi trực tiếp GetUserIsOnline DTO (không cần query lại DB)
            messagingTemplate.convertAndSend("/topic/user-status", userOnlineStatus);

            log.info("Broadcasted to /topic/user-status: userId={}", userOnlineStatus.getUserId());

        } catch (Exception e) {
            log.error("Error broadcasting user online status: {}", e.getMessage(), e);

            // Retry sau 100ms
            try {
                Thread.sleep(100);
                messagingTemplate.convertAndSend("/topic/user-status", userOnlineStatus);
                log.info(" Retry successful!");
            } catch (Exception retryError) {
                log.error(" Retry failed: {}", retryError.getMessage());
            }
        }
    }
}
