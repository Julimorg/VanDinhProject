package com.example.persistence.entity;



import com.example.persistence.enumTable.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Orders", indexes = {
        @Index(name = "idx_order_user",        columnList = "user_id"),
        @Index(name = "idx_order_status",      columnList = "orderStatus"),
        @Index(name = "idx_order_create",      columnList = "create_at"),
        @Index(name = "idx_order_user_status", columnList = "user_id, orderStatus")
})
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String orderId;

    private String orderCode;

    private String shipAddress;

    private String createBy;

    private String updateBy;

    private String approvedBy;

    private String canceledBy;

    private int total_quantity;


    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Column(nullable = false)
    private BigDecimal orderAmount = BigDecimal.ZERO ;

    @CreationTimestamp
    private LocalDateTime createAt;

    @UpdateTimestamp
    private LocalDateTime updateAt;

    @UpdateTimestamp
    private LocalDateTime deletedAt;

    private LocalDateTime completeAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems = new ArrayList<>();

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Payment payment;
}
