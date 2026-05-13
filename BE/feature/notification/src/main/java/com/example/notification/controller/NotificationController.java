package com.example.notification.controller;

import com.example.common.dto.notification.request.MarkNotificationAsReadReq;
import com.example.common.dto.notification.request.SendNotiToAdminReq;
import com.example.common.dto.notification.request.SendNotiToOneUserOrManyUserReq;
import com.example.common.dto.notification.response.*;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import com.example.notification.repository.UserNotificationsRepository;
import com.example.notification.service.NotificationService;
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


    @GetMapping("/online-status")
    public ApiResponse<Page<GetUserIsOnline>> getUserIsOnline(
            @PageableDefault(size = 10, sort = "userName", direction = Sort.Direction.ASC) Pageable pageable
    ) {

        return ApiResponse.<Page<GetUserIsOnline>>builder()
                .status_code(SuccessCode.GET_USER_ONLINE.getStatusCode().value())
                .message(SuccessCode.GET_USER_ONLINE.getMessage())
                .data(notificationService
                        .getUserOnline(pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @MessageMapping("/users/refresh")
    @SendTo("/topic/users-list")
    public Page<GetUserIsOnline> refreshUsersList(Pageable pageable) {
        return notificationService.getUserOnline(pageable);
    }

    @PostMapping("/admin/send-notifications")
    public ApiResponse<SendNotiToOneUserOrManyUserRes> sendNotiToOneUserOrManyUser(
            @RequestBody SendNotiToOneUserOrManyUserReq req) {

        return ApiResponse.<SendNotiToOneUserOrManyUserRes>builder()
                .status_code(SuccessCode.SEND_TO_USER_SUCCESSFULLY.getStatusCode().value())
                .message(SuccessCode.SEND_TO_USER_SUCCESSFULLY.getMessage())
                .data(notificationService.sendToUsers(req))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/system/{userId}")
    public ApiResponse<List<GetSystemTopFiveNotifications>> getSystemTopFiveNotifications(@PathVariable String userId) {

        return ApiResponse.<List<GetSystemTopFiveNotifications>>builder()
                .status_code(SuccessCode.GET_TOP_FIVE_NOTIFICATIONS.getStatusCode().value())
                .message(SuccessCode.GET_TOP_FIVE_NOTIFICATIONS.getMessage())
                .data(notificationService.getSystemTopFiveNotifications(userId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/system-all/{userId}")
    public ApiResponse<Page<GetSystemAllNotificationsRes>> getSystemAllNotifications(
            @PathVariable String userId,
            @RequestParam(required = false) String isRead,
            @PageableDefault(size = 10, sort = "deliveredAt", direction = Sort.Direction.ASC ) Pageable pageable) {

        return ApiResponse.<Page<GetSystemAllNotificationsRes>>builder()
                .status_code(SuccessCode.GET_ALL_NOTIFICATIONS.getStatusCode().value())
                .message(SuccessCode.GET_ALL_NOTIFICATIONS.getMessage())
                .data(notificationService.getAllNotifications(userId, isRead, pageable))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/unread-count/{userId}")
    public ApiResponse<Integer> getCountNotiMarkIsReadFalse(@PathVariable String userId){
        return ApiResponse.<Integer>builder()
                .status_code(SuccessCode.GET_UNREAD_NOTIFICATIONS.getStatusCode().value())
                .message(SuccessCode.GET_UNREAD_NOTIFICATIONS.getMessage())
                .data(notificationService.getUnreadCount(userId))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping("/mark-read/{userNotificationId}")
    public ApiResponse<MarkNotificationAsReadRes> markNotificationAsRead(
            @PathVariable String userNotificationId,
            @RequestBody MarkNotificationAsReadReq request){
        return ApiResponse.<MarkNotificationAsReadRes>builder()
                .status_code(SuccessCode.MARK_AS_READ.getStatusCode().value())
                .message(SuccessCode.MARK_AS_READ.getMessage())
                .data(notificationService.markAsRead(userNotificationId))
                .timestamp(LocalDateTime.now())
                .build();
    }

//    @PatchMapping("/mark-click/{userNotificationId}")
//    public ApiResponse<MarkNotificationAsClickedRes> markNotificationAsClicked(@PathVariable String userNotificationId){
//        return ApiResponse.<MarkNotificationAsClickedRes>builder()
//                .status_code(HttpStatus.OK.value())
//                .message("Send Successfully!")
//                .data(notificationService(userNotificationId))
//                .timestamp(LocalDateTime.now())
//                .build();
//    }

    @PostMapping("/user/send-to-admin")
    public ApiResponse<SendNotiToAdminRes> sendNotiToAdmins(
            @RequestBody SendNotiToAdminReq req) {

        return ApiResponse.<SendNotiToAdminRes>builder()
                .status_code(SuccessCode.SEND_TO_ADMIN.getStatusCode().value())
                .message(SuccessCode.SEND_TO_ADMIN.getMessage())
                .data(notificationService.sendToAdmins(req))
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
