package com.example.messaging.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Base WebSocket config — endpoint + message broker.
 *
 * WebSocketAuthInterceptor KHÔNG inject ở đây vì nó depend vào :feature:auth.
 * Interceptor được đăng ký riêng tại:
 *   feature/auth/.../security/WebSocketSecurityConfig.java
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketBrokerConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Client subscribe: /topic/xxx hoặc /queue/xxx
        config.enableSimpleBroker("/topic", "/queue");

        // Client send: /app/xxx → @MessageMapping
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}