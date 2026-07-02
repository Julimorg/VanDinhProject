# Realtime Admin Notification Debug and Fix Guide

## Problem

When a user confirms an order, the backend saves/sends a notification to admin/staff users, but the Admin frontend does not receive the realtime notification.

Observed log:

```text
UserDestinationMessageHandler : No active sessions for user destination: /user/71c543fe-702a-4bc6-9e13-7ba3bdfc5ff2/queue/notifications
NotificationService          : Realtime noti -> user [71c543fe-702a-4bc6-9e13-7ba3bdfc5ff2]
```

The SQL-looking log:

```text
id is not null fetch first ? rows only
```

is not the main error. It is Hibernate/JPA checking whether a `UserDevice` row exists with a non-null socket id.

## Current Flow

1. `feature/order/src/main/java/com/example/service/OrderService.java`
   - `confirmOrderByUser(...)` calls `notificationInterface.notifyAdminsOrderConfirmed(userId)`.

2. `feature/notification/src/main/java/com/example/notification/service/NotificationService.java`
   - `notifyAdminsOrderConfirmed(...)` finds all `ADMIN` and `STAFF` users.
   - `buildAndSend(...)` checks `userPresenceInternalService.isOnline(targetUserId)`.
   - If online, it calls `notificationHelper.sendToNotificationUser(targetUserId, payload)`.

3. `feature/notification/src/main/java/com/example/notification/util/NotificationHelper.java`
   - Sends with:

```java
messagingTemplate.convertAndSendToUser(userId, "/queue/notifications", payload);
```

4. Frontend must subscribe to:

```text
/user/queue/notifications
```

This destination pairing is correct.

## Root Cause

The backend logs show Spring tried to send to:

```text
/user/{adminId}/queue/notifications
```

but Spring could not find any active WebSocket session registered for that admin id.

The likely cause in the current modular app is:

`shared/messaging/src/main/java/com/example/messaging/config/WebSocketBrokerConfig.java` defines the broker and endpoint, but it does not register `WebSocketAuthInterceptor` with `configureClientInboundChannel(...)`.

Because of that, the STOMP `CONNECT` frame may succeed from the frontend, but the server does not attach this principal:

```java
accessor.setUser(new UsernamePasswordAuthenticationToken(userId, null));
```

Without that principal, `convertAndSendToUser(adminId, "/queue/notifications", payload)` cannot route to the admin browser session.

## Backend Fix

Update `shared/messaging/src/main/java/com/example/messaging/config/WebSocketBrokerConfig.java`.

Expected final shape:

```java
package com.example.messaging.config;

import com.example.messaging.interceptor.WebSocketAuthInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableAsync
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
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
```

Notes:

- `configureClientInboundChannel(...)` is the important missing part.
- `config.setUserDestinationPrefix("/user")` is optional because `/user` is Spring's default, but add it to make the contract explicit.
- Do not send directly to `/user/{id}/queue/notifications` from application code. Keep using `convertAndSendToUser(userId, "/queue/notifications", payload)`.

## Frontend Checklist

The Admin frontend must send the JWT in the STOMP `CONNECT` headers, not only in the SockJS URL or HTTP headers.

Example:

```js
const socket = new SockJS(`${apiBaseUrl}/ws`);
const stompClient = Stomp.over(socket);

stompClient.connect(
  {
    Authorization: `Bearer ${accessToken}`,
  },
  () => {
    stompClient.subscribe('/user/queue/notifications', (message) => {
      const notification = JSON.parse(message.body);
      console.log('Realtime notification:', notification);
    });
  },
  (error) => {
    console.error('WebSocket error:', error);
  }
);
```

Common frontend mistakes:

- Subscribing to `/queue/notifications` instead of `/user/queue/notifications`.
- Sending `authorization` lowercase while backend reads `Authorization`.
- Sending token only in the initial login/API request, not in the STOMP `CONNECT`.
- Connecting with a different account/token than the admin id that receives the notification.

## Verification Steps

1. Start backend and connect Admin frontend WebSocket.

2. Confirm backend logs contain:

```text
WebSocket CONNECT – user [ADMIN_USER_ID] ONLINE | sessionId = ...
```

If this log does not appear, the interceptor is still not registered or the frontend is not sending the token correctly.

3. Check database:

```sql
select user_id, socket_id, last_seen
from user_device
where user_id = 'ADMIN_USER_ID';
```

Expected:

```text
socket_id is not null
```

4. Confirm an order as a user.

5. Expected backend logs:

```text
Realtime noti -> user [ADMIN_USER_ID]
```

and no log like:

```text
No active sessions for user destination
```

6. Admin frontend should receive a message from:

```text
/user/queue/notifications
```

## If It Still Fails

Check these in order:

1. Only one `WebSocketBrokerConfig` should be active in the running app.
   - The repo also has legacy code under `src/main/java/com/example/managementapi/...`.
   - The modular app should use `shared/messaging/...`.

2. The admin id in the send log must equal the user id extracted from the admin JWT.

3. `WebSocketAuthInterceptor` must run before the subscription/send.
   - Add a temporary log in `handleConnect(...)` if needed.

4. Admin must stay connected while the order is confirmed.
   - A previous successful subscribe does not matter if the socket reconnects without the `Authorization` header.

5. If there are multiple backend instances, the simple in-memory broker will not route user sessions across instances.
   - Use sticky sessions or a shared broker such as RabbitMQ/STOMP relay for production scaling.

## Recommended Small Cleanup

`NotificationHelper.buildPayload(...)` currently does not include `userNotificationId`, because the payload is built from `Notifications` before/without using the saved `UserNotifications` row.

Realtime display can still work without it, but mark-as-read actions usually need `userNotificationId`. A later improvement should build the realtime payload from `UserNotifications` after save, or set `userNotificationId` before sending.

