package com.example.managementapi.Controller;


import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Notification.MarkNotificationAsReadReq;
import com.example.managementapi.Dto.Request.Notification.SendNotiToAdminReq;
import com.example.managementapi.Dto.Request.Notification.SendNotiToOneUserOrManyUserReq;
import com.example.managementapi.Dto.Response.Notification.*;
import com.example.managementapi.Repository.UserNotificationsRepository;
import com.example.managementapi.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
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

    @MessageMapping("/sendMessage")
    @SendTo("/topic/notifications")
    public String sendMessage(String message){
        System.out.println("message : "+message);
        return message;
    }


    @PostMapping("/admin/send-notifications")
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

    @GetMapping("/system/{userId}")
    public ApiResponse<List<GetSystemTopFiveNotifications>> getSystemTopFiveNotifications(@PathVariable String userId) {

        return ApiResponse.<List<GetSystemTopFiveNotifications>>builder()
                .status_code(HttpStatus.OK.value())
                .message("Send Successfully!")
                .data(notificationService.getSystemTopFiveNotifications(userId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/system-all/{userId}")
    public ApiResponse<Page<GetSystemAllNotificationsRes>> getSystemAllNotifications(
            @PathVariable String userId,
            @RequestParam(required = false) String isRead,
            @PageableDefault(size = 10, sort = "deliveredAt", direction = Sort.Direction.ASC) Pageable pageable) {

        return ApiResponse.<Page<GetSystemAllNotificationsRes>>builder()
                .status_code(HttpStatus.OK.value())
                .message("Send Successfully!")
                .data(notificationService.getSystemAllNotifications(userId, isRead, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping("/mark-read/{userNotificationId}")
    public ApiResponse<MarkNotificationAsReadRes> markNotificationAsRead(
            @PathVariable String userNotificationId,
            @RequestBody MarkNotificationAsReadReq request){
        return ApiResponse.<MarkNotificationAsReadRes>builder()
                .status_code(HttpStatus.OK.value())
                .message("Send Successfully!")
                .data(notificationService.markNotificationAsRead(userNotificationId, request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping("/mark-click/{userNotificationId}")
    public ApiResponse<MarkNotificationAsClickedRes> markNotificationAsClicked(@PathVariable String userNotificationId){
        return ApiResponse.<MarkNotificationAsClickedRes>builder()
                .status_code(HttpStatus.OK.value())
                .message("Send Successfully!")
                .data(notificationService.markNotificationAsClicked(userNotificationId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping("/user/send-to-admin")
    public ApiResponse<SendNotiToAdminRes> sendNotiToAdmins(
            @RequestBody SendNotiToAdminReq req) {

        return ApiResponse.<SendNotiToAdminRes>builder()
                .status_code(HttpStatus.OK.value())
                .message("Send Successfully!")
                .data(notificationService.sendNotiToAdmins(req))
                .timestamp(LocalDateTime.now())
                .build();
    }


//    @GetMapping("/my-notifications/{userId}")
//    public List<NotificationRes> getMyNotifications(@PathVariable String userId) {
//        // Lấy userId từ JWT (bạn đã có SecurityContext)
//
//        return userNotiRepo.findAllByUserId(userId)
//                .stream()
//                .map(un -> {
//                    var noti = un.getNotifications();
//                    return NotificationRes.builder()
//                            .notificationId(noti.getNotificationId())
//                            .title(noti.getTitle())
//                            .message(noti.getMessage())
//                            .type(noti.getType())
//                            .createdAt(noti.getCreatedAt())
//                            .build();
//                })
//                .collect(Collectors.toList());
//    }

}
