package com.example.persistence.entity;



import com.example.persistence.enumTable.DeviceType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "UserDevice", indexes = {
        @Index(name = "idx_userdevice_user",        columnList = "userId"),
        @Index(name = "idx_userdevice_token",       columnList = "deviceToken", unique = true)
})
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
