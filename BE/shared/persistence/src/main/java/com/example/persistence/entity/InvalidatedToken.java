package com.example.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "InvalidatedToken", indexes = {
        @Index(name = "idx_token_expiry", columnList = "expiryDate")
})
public class InvalidatedToken {
    @Id
    @Column(unique = true)
    private String id;
    private Date expiryDate;

    @CreationTimestamp
    private LocalDateTime createAt;
    @UpdateTimestamp
    private LocalDateTime updateAt;
}
