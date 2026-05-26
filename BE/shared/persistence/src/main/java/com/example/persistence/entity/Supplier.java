package com.example.persistence.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Supplier", indexes = {
        @Index(name = "idx_supplier_name",  columnList = "supplierName"),
        @Index(name = "idx_supplier_phone", columnList = "supplierPhone"),
        @Index(name = "idx_supplier_email", columnList = "supplierEmail"),
})
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String supplierId;

    private String supplierName;

    private String supplierAddress;

    @Column(unique = true)
    private String supplierPhone;

    @Email
    @Column(unique = true)
    private String supplierEmail;


    private String supplierImg;

    @CreationTimestamp
    private LocalDateTime createAt;
    @UpdateTimestamp
    private LocalDateTime updateAt;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Product> products;


    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Color> colors;


}
