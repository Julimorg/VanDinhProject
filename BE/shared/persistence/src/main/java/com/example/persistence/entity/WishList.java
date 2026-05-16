package com.example.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
        name = "WishList",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "product_id"}
        ),
        indexes = {
                @Index(name = "idx_wishlist_user",    columnList = "user_id"),
                @Index(name = "idx_wishlist_product", columnList = "product_id")
        }
)
public class WishList {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String wishListId;

    @CreationTimestamp
    private LocalDateTime createAt;
    @UpdateTimestamp
    private LocalDateTime updateAt;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

}
