package com.example.persistence.entity;

import com.example.persistence.enumTable.DiaryStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    name = "user_diary",
    indexes = {
            @Index(name = "idx_date_start", columnList = "start_date"),
            @Index(name = "idx_date_end", columnList = "end_date"),
            @Index(name = "idx_diary_name", columnList = "diary_name"),
            @Index(name = "idx_diary_created_by", columnList = "created_by"),
    }
)
@EntityListeners(AuditingEntityListener.class)
public class UserDiary {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "diary_name", nullable = false)
    private String diaryName;

    @Enumerated(EnumType.STRING)
    @Column(name = "diary_status", nullable = false)
    private DiaryStatus diaryStatus;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "total_amount", precision = 15, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "total_quantity")
    private BigDecimal totalQuantity = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "update_at", nullable = false)
    private LocalDateTime updateAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
