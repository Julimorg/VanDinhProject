package com.example.persistence.entity;

import com.example.persistence.enumTable.PurchaseOrderStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "purchase_order",
        indexes = {
                @Index(name = "idx_po_code", columnList = "poCode", unique = true),
                @Index(name = "idx_po_status_order_date", columnList = "status, orderDate"),
                @Index(name = "idx_po_supplier_name", columnList = "supplierName"),
        }
)
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String purchaseOrderId;

    @NotBlank(message = "Purchase Order Code can not be empty! ")
    private String poCode;

    @NotBlank(message = "Supplier Name can not be empty !")
    private String supplierName;

    private String note;

    private String createdBy;

    private BigDecimal totalPrice = BigDecimal.ZERO ;

    @Column(name = "total_quantity", columnDefinition = "integer default 0")
    private int totalQuantity;

    private LocalDateTime orderDate;

    private LocalDateTime receivedDate;

    @Enumerated(EnumType.STRING)
    private PurchaseOrderStatus status;

    @CreationTimestamp
    private LocalDateTime createAt;

    @UpdateTimestamp
    private LocalDateTime updateAt;

    @OneToMany(mappedBy = "purchaseOrder",
            cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PurchaseOrderItem> items = new ArrayList<>();

}
