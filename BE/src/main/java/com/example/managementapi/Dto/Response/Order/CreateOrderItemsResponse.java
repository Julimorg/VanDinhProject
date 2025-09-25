package com.example.managementapi.Dto.Response.Order;

import com.example.managementapi.Entity.Order;
import com.example.managementapi.Entity.Product;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderItemsResponse {
    private String orderItemId;
    private int quantity;
    private BigDecimal price;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private LocalDateTime deletedAt;

}
