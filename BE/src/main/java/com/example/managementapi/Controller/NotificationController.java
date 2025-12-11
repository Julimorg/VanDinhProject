package com.example.managementapi.Controller;


import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Notification.SendNotiToOneUserOrManyUserReq;
import com.example.managementapi.Dto.Response.Notification.NotificationRes;
import com.example.managementapi.Dto.Response.Notification.SendNotiToOneUserOrManyUserRes;
import com.example.managementapi.Repository.UserNotificationsRepository;
import com.example.managementapi.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    private final UserNotificationsRepository userNotiRepo;

    @PostMapping("/send-many")
    public ApiResponse<SendNotiToOneUserOrManyUserRes> sendNotiToOneUserOrManyUser(
            @RequestBody SendNotiToOneUserOrManyUserReq req) {

        return ApiResponse.<SendNotiToOneUserOrManyUserRes>builder()
                .status_code(HttpStatus.OK.value())
                .message("Send Successfully!")
                .data(notificationService
                        .sendToOneUserOrManyUser(req))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/my-notifications/{userId}")
    public List<NotificationRes> getMyNotifications(@PathVariable String userId) {
        // Lấy userId từ JWT (bạn đã có SecurityContext)

        return userNotiRepo.findAllByUserId(userId)
                .stream()
                .map(un -> {
                    var noti = un.getNotifications();
                    return NotificationRes.builder()
                            .notificationId(noti.getNotificationId())
                            .title(noti.getTitle())
                            .message(noti.getMessage())
                            .type(noti.getType())
                            .createdAt(noti.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

}
