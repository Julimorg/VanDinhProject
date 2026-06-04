package com.example.common.dto.diary.response;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class DiaryItemResponse {

    private String id;
    private String productId;
    private String productName;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private String itemNote;
}
