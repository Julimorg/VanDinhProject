package com.example.managementapi.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "OrderItem")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String orderItemId;

    @Column
    private String productId;

    @Column
    private String productName;

    @Column
    private String productCode;

    @ElementCollection
    private List<String> productImage;

    private String productVolume;

    private String productUnit;

    @Column
    private BigDecimal productPrice;

    private Double discount;

    private String colorName;

    private String categoryName;

    private int quantity;

    @Column
    private BigDecimal price;

    @CreationTimestamp
    private LocalDateTime createAt;

    @UpdateTimestamp
    private LocalDateTime updateAt;

    private LocalDateTime deletedAt;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

}
