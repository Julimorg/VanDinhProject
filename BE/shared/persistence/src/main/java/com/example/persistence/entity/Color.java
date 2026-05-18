package com.example.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Color", indexes = {
        @Index(name = "idx_color_name", columnList = "colorName"),
        @Index(name = "idx_color_code", columnList = "colorCode"),
        @Index(name = "idx_color_hex_code", columnList = "hexCode"),
})
public class Color {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String colorId;

    private String colorName;
    @Column(unique = true)
    private String colorCode;

    @Column(unique = true)
    private String hexCode;

    private String colorFamily;

    private String colorCollection;

    private String finishType;

    private Boolean isActive;

    private String colorImg;

    @CreationTimestamp
    private LocalDateTime createAt;
    @UpdateTimestamp
    private LocalDateTime updateAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;


    @OneToMany(mappedBy = "color", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Product> products;
}
