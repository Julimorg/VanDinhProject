package com.example.managementapi.Events;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;


@Component
@RequiredArgsConstructor
@Slf4j
public class UserStatusChangeListener {
    private final SimpMessagingTemplate messagingTemplate;

//    @Async
    @EventListener
    public void handleUserStatusChange(UserStatusChangeEvent event) {

        log.info(" Broadcasting user status change: userId={}, status={}",
                event.getUserId(), event.getStatus());

        try {
            //? Tạo payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", event.getUserId());
            payload.put("socketId", event.getSocketId());
            payload.put("status", event.getStatus());
            payload.put("lastSeen", event.getLastSeen());
            payload.put("timestamp", event.getTimestamp());

            //? Gửi message
            messagingTemplate.convertAndSend("/topic/user-status", payload);

            log.info(" Broadcasted to /topic/user-status: {}", payload);

        } catch (Exception e) {
            log.error(" Error broadcasting user status: {}", e.getMessage(), e);

            //? Retry sau 100ms
            try {
                Thread.sleep(100);

                Map<String, Object> payload = new HashMap<>();
                payload.put("userId", event.getUserId());
                payload.put("socketId", event.getSocketId());
                payload.put("status", event.getStatus());
                payload.put("lastSeen", event.getLastSeen());
                payload.put("timestamp", event.getTimestamp());

                messagingTemplate.convertAndSend("/topic/user-status", payload);
                log.info(" Retry successful!");

            } catch (Exception retryError) {
                log.error(" Retry failed: {}", retryError.getMessage());
            }
        }
    }
}
