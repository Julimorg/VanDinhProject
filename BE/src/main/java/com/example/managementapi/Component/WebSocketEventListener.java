package com.example.managementapi.Component;

import com.example.managementapi.Service.UserDeviceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {
    private final UserDeviceService userDeviceService;

    // Sự kiện khi một session STOMP được kết nối (và xác thực)
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = headerAccessor.getUser();

        // 1. Lấy STOMP Session ID (chính là socketId bạn muốn lưu)
        String sessionId = headerAccessor.getSessionId();

        if (principal != null) {
            // 2. Lấy User ID đã được xác thực
            String userId = principal.getName(); // Giả sử Principal.getName() trả về userId

            log.info("STOMP Session Connected: userId={}, sessionId={}", userId, sessionId);
            // 3. Lưu thông tin vào DB
            userDeviceService.saveUserSocketId(userId, sessionId);

        } else {
            // Xử lý các kết nối không có authentication nếu cần (thường thì không)
            log.warn("STOMP Session Connected without Principal. Session ID: {}", sessionId);
        }
    }

    // Sự kiện khi một session STOMP bị ngắt kết nối
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        log.info("STOMP Session Disconnected: sessionId={}", sessionId);
        // Xóa socketId khỏi DB khi người dùng ngắt kết nối
        userDeviceService.removeUserSocketId(sessionId);
    }
}
