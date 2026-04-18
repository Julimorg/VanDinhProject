package com.example.persistence.entity;



import com.example.common.enums.DeviceType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "UserDevice")
public class UserDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String userDeviceId;

    private String userId;

    @Enumerated(EnumType.STRING)
    private DeviceType deviceType;

    private String deviceToken;

    private String socketId;

    private LocalDateTime lastSeen;

}
