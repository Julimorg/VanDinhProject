package com.example.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "user_diary_item",
        indexes = {
                @Index(name = "idx_item_diary_id", columnList = "diary_id"),
                @Index(name = "idx_item_product_id", columnList = "product_id")
        }
)
public class UserDiaryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id", nullable = false)
    private UserDiary diary;

    @Column(name = "product_id")
    private String productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "quantity" )
    private int quantity;

    @Column(name = "volume")
    private String volume;

    @Column(name = "color")
    private String color;

    @Column(name = "item_date", nullable = false)
    private LocalDateTime itemDate;

    @Column(name = "unit_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(name = "item_note" , columnDefinition = "TEXT")
    private String itemNote;

    @CreationTimestamp
    @Column(name = "createAt")
    private LocalDateTime createAt;

    @UpdateTimestamp
    @Column(name = "updateAt")
    private LocalDateTime updateAt;


}


