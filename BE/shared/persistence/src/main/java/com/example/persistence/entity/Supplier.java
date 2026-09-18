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

    // Khong cascade delete: xoa 1 Supplier khong duoc phep tu dong xoa cac Product/Color dang tham
    // chieu supplier do. SupplierService.deleteSupplier() phai kiem tra va tu choi xoa neu con ban ghi tham chieu.
    @OneToMany(mappedBy = "supplier", fetch = FetchType.LAZY)
    private List<Product> products;


    @OneToMany(mappedBy = "supplier", fetch = FetchType.LAZY)
    private List<Color> colors;


}
