package com.example.messaging.interceptor;

import com.example.common.interfaces.user.UserPresenceInternalService;
import com.example.common.security.TokenValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final TokenValidator tokenValidator;

    private final UserPresenceInternalService  userPresenceInternalService;

    /*
     * Map sessionId → userId để resolve userId khi DISCONNECT.
     * accessor.getUser() không đáng tin cậy ở DISCONNECT frame.
     * ConcurrentHashMap vì WebSocket xử lý multi-thread.
     */
    private final ConcurrentHashMap<String, String> sessionUserMap = new ConcurrentHashMap<>();


    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        StompCommand command = accessor.getCommand();

        if (command == null) return message;

        return switch (command) {
            case CONNECT    -> handleConnect(message, accessor);
            case DISCONNECT -> handleDisconnect(message, accessor);
            default         -> message;
        };
    }


    private Message<?> handleConnect(Message<?> message, StompHeaderAccessor accessor) {
        String authHeader = accessor.getFirstNativeHeader("Authorization");

        // 1. Check header tồn tại
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            log.warn("WebSocket CONNECT rejected – missing or malformed Authorization header");
            return null;
        }

        String token = authHeader.substring(7);

        // 2. Validate token (expired / invalid signature)
        if (!tokenValidator.isValid(token)) {
            log.warn("WebSocket CONNECT rejected – token invalid or expired");
            return null;
        }

        // 3. Extract userId
        String userId = tokenValidator.extractUserId(token);
        if (!StringUtils.hasText(userId)) {
            log.warn("WebSocket CONNECT rejected – cannot extract userId from token");
            return null;
        }

        String sessionId = accessor.getSessionId();

        // 4. Lưu mapping để dùng khi DISCONNECT
        sessionUserMap.put(sessionId, userId);

        // 5. Set principal để Spring Security nhận diện trong các handler sau
        accessor.setUser(new UsernamePasswordAuthenticationToken(userId, null));

        // 6. Delegate hoàn toàn việc track online status cho UserPresencePort
        userPresenceInternalService.markOnline(userId, sessionId);

        log.info("WebSocket CONNECT – user [{}] ONLINE | sessionId = {}", userId, sessionId);

        return message;
    }

    private Message<?> handleDisconnect(Message<?> message, StompHeaderAccessor accessor) {
        String sessionId = accessor.getSessionId();

        // Lấy userId từ map — không dùng accessor.getUser() vì không đáng tin cậy ở DISCONNECT
        String userId = sessionUserMap.remove(sessionId);

        if (!StringUtils.hasText(userId)) {
            log.warn("WebSocket DISCONNECT – cannot resolve userId for sessionId [{}]", sessionId);
            return message;
        }

        // Delegate việc clear online status
        userPresenceInternalService.markOffline(userId, sessionId);

        log.info("WebSocket DISCONNECT – user [{}] OFFLINE | sessionId = {}", userId, sessionId);

        return message;
    }



}
