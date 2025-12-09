package com.example.managementapi.Dto.Response.Notification;

import com.example.managementapi.Enum.UserNotifactionSendChannel;
import com.example.managementapi.Enum.UserNotifactionStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendNotiToOneUserOrManyUserRes {
    private String notificationId;

    private List<UserNotiDetail> results;

}
