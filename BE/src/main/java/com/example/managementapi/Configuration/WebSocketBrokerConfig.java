package com.example.managementapi.Configuration;

import com.example.managementapi.Component.WebSocketAuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketBrokerConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(webSocketAuthInterceptor);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {

        //? Tạo subscribe để client có thể connect vào
        config.enableSimpleBroker("/topic", "/queue", "/user");

        //? Tạo Entry endpoint để các @MessageMapping sẽ nhận message từ /app/...
        config.setApplicationDestinationPrefixes("/app");

        //? Tạo private tunnel để có thể send private message đến 1 user cụ thể
        config.setUserDestinationPrefix("/user");

//        config.setPreservePublishOrder(true);

    }


    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        //? Tạo endpoint cho Websocket
        registry.addEndpoint("/ws") // --> http:..../ws
                //? config CORS
                .setAllowedOriginPatterns("*")
                //? Helper cho toàn bộ browser cũ
                .withSockJS();
    }

}
