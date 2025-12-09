package com.example.managementapi.Entity;


import com.example.managementapi.Enum.UserNotifactionSendChannel;
import com.example.managementapi.Enum.UserNotifactionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "UserNotifiactions")
public class UserNotifications {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String userNotificationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notificationId")
    private Notifications notifications;

    private String userId;

    private Boolean isRead;

    private LocalDateTime readAt;

    private LocalDateTime deliveredAt;

    private LocalDateTime clickedAt;

    @Enumerated(EnumType.STRING)
    private UserNotifactionStatus status;

    @Enumerated(EnumType.STRING)
    private UserNotifactionSendChannel sendChannel ;

}
