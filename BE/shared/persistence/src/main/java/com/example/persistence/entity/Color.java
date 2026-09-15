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

    @Column(name = "color_name", nullable = false)
    private String colorName;

    @Column(name = "color_code", nullable = false)
    private String colorCode;

    @Column(name = "hex_code")
    private String hexCode;

    @Column(name = "color_family")
    private String colorFamily;

    @Column(name = "color_collection")
    private String colorCollection;

    @Column(name = "finish_type")
    private String finishType;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "color_img")
    private String colorImg;

    @CreationTimestamp
    @Column(name = "create_at")
    private LocalDateTime createAt;

    @UpdateTimestamp
    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id")
    private Album album;
}
