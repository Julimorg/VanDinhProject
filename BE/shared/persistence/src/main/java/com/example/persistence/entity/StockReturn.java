package com.example.persistence.entity;
import com.example.persistence.enumTable.ReturnReason;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_return", indexes = {
        @Index(columnList = "purchase_order_item_id"),
        @Index(columnList = "return_date")
})
public class StockReturn {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String returnId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_item_id", nullable = false)
    private PurchaseOrderItem purchaseOrderItem;

    private int quantityReturned;

    @Enumerated(EnumType.STRING)
    private ReturnReason reason;

    private String note;

    private LocalDateTime returnDate;

    private String createdBy;

    @CreationTimestamp
    private LocalDateTime createAt;

}
