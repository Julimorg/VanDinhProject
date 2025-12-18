package com.example.managementapi.Component;

import com.example.managementapi.Entity.UserDevice;
import com.example.managementapi.Repository.UserDeviceRepository;
import com.example.managementapi.Service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final UserDeviceRepository deviceRepo;

    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        //* ============ CLIENT CONNECT ============
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {

                log.warn("WebSocket CONNECT without Token → Can not allow to Connect");
//                throw new SecurityException("Token không hợp lệ");
                return null;
            }

            String token = authHeader.substring(7);

            String userId = jwtService.extractUserId(token);

            if( userId == null ) {
                log.warn("WebSocket CONNECT without User ID");
                return null;
            }

            String sessionId = accessor.getSessionId();

            UserDevice device = deviceRepo.findByUserId(userId)
                    .orElseGet(UserDevice::new);

            device.setUserId(userId);
            device.setSocketId(sessionId);
            device.setLastSeen(LocalDateTime.now());
            deviceRepo.save(device);

            log.info("WebSocket CONNECT thành công – User {} ONLINE với socketId = {}", userId, sessionId);

            Principal principal = new UsernamePasswordAuthenticationToken(userId, null);
            accessor.setUser(principal);

            log.info("Set Principal: userId = {}", userId);

        }

        //* ============ CLIENT DISCONNECT ============
        if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
            Principal user = accessor.getUser();
            if ( user != null ) {
               String userId = user.getName();

               deviceRepo.findByUserId(userId).ifPresent(device -> {
                   device.setSocketId(null);
                   device.setLastSeen(LocalDateTime.now());
                   deviceRepo.save(device);
                   log.info("👋 User [{}] DISCONNECTED - Successfully Removed socketId", userId);
               });
            }
        }
        return message;
    }
}
