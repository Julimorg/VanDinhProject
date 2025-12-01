package com.example.managementapi.Entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Notifications")
public class Notifications {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String notificationId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String type;

    private String createBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
