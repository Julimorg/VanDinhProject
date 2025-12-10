package com.example.managementapi.Controller;


import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Notification.SendNotiToOneUserOrManyUserReq;
import com.example.managementapi.Dto.Response.Notification.SendNotiToOneUserOrManyUserRes;
import com.example.managementapi.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

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

}
