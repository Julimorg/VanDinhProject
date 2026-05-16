package com.example.persistence.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Product", indexes = {
        @Index(name = "idx_product_category",  columnList = "category_id"),
        @Index(name = "idx_product_supplier",  columnList = "supplier_id"),
        @Index(name = "idx_product_color",     columnList = "color_id"),
        @Index(name = "idx_product_name",      columnList = "productName")
})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String productId;
    private String productName;
    private String productDescription;

    @ElementCollection
    private List<String> productImage = new ArrayList<>();
    private String productVolume;
    private String productUnit;
    private String productCode;


    private int productQuantity;

    private double discount;

    private BigDecimal productPrice;

    private LocalDateTime lastNotified;

    @CreationTimestamp
    private LocalDateTime createAt;
    @UpdateTimestamp
    private LocalDateTime updateAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_id", nullable = false)
    private Color color;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;


}
