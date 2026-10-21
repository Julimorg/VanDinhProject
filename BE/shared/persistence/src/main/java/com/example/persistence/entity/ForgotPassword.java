package com.example.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ForgotPassword")
public class ForgotPassword {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private int otp;

    @Column(nullable = false)
    private LocalDateTime expirationTime;

    // De nullable (khong set nullable=false): neu set NOT NULL, Hibernate ALTER TABLE them cot nay
    // vao bang da co du lieu san (ddl-auto=update tren DB that) se bi Postgres tu choi vi khong co
    // gia tri backfill cho cac dong cu ("contains null values"). Cac dong cu se co verified=null,
    // ForgotPassService coi null la "chua verify" (an toan, dung default).
    @Builder.Default
    private Boolean verified = false;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
