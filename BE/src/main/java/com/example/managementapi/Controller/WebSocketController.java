package com.example.managementapi.Controller;


import com.example.managementapi.Dto.Response.Notification.NotificationRes;
import com.example.managementapi.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class WebSocketController {

    private final NotificationService notificationService;

    // 1. Gửi cho 1 user cụ thể
    @PostMapping("/private")
    public ResponseEntity<String> sendPrivate(@RequestBody SendNotificationRequest request) {
        NotificationRes noti = NotificationRes.builder()
                .notificationId(UUID.randomUUID().toString())
                .title(request.title())
                .message(request.message())
                .type(request.type())
                .createdAt(LocalDateTime.now())
                .build();

        notificationService.sendToUser(request.targetUserId(), noti);
        log.info("Sent private notification to user {}", request.targetUserId());
        return ResponseEntity.ok("Đã gửi cho user " + request.targetUserId());
    }

    // 2. Gửi cho tất cả user
    @PostMapping("/broadcast")
    public ResponseEntity<String> broadcast(@RequestBody SendNotificationRequest request) {
        NotificationRes noti = NotificationRes.builder()
                .notificationId(UUID.randomUUID().toString())
                .title(request.title())
                .message(request.message())
                .type(request.type())
                .createdAt(LocalDateTime.now())
                .build();

        notificationService.sendToAll(noti);
        return ResponseEntity.ok("Đã gửi broadcast tới tất cả user");
    }

    // Request DTO
    record SendNotificationRequest(
            String targetUserId,   // để trống nếu broadcast
            String title,
            String message,
            String type            // ORDER, PROMOTION, SYSTEM, CHAT...
    ) {}
}
