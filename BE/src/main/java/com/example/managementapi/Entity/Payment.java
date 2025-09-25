package com.example.managementapi.Entity;

import com.example.managementapi.Enum.PaymentMethod;
import com.example.managementapi.Enum.PaymentMethodStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String paymentId;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentMethodStatus paymentStatus;

    private String responseCode;

    private String transactionStatus;

    private String transactionId;

    private String bankCode;

    private String bankTransactionNo;

    private String cardType;

    private String cardNumber;

    private String txnType;

    private String orderInfo;

    private String secureHash;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount = BigDecimal.ZERO;

    private LocalDateTime payDate;

    @CreationTimestamp
    private LocalDateTime createAt;
    @UpdateTimestamp
    private LocalDateTime updateAt;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
