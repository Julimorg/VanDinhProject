package com.example.persistence.entity;



import com.example.common.enums.UserNotifactionSendChannel;
import com.example.common.enums.UserNotifactionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "UserNotifications")
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

    private LocalDateTime createAt;

    private LocalDateTime clickedAt;

    @Enumerated(EnumType.STRING)
    private UserNotifactionStatus status;

    @Enumerated(EnumType.STRING)
    private UserNotifactionSendChannel sendChannel ;

}
