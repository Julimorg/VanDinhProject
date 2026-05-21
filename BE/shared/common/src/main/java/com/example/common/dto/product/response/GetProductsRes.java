package com.example.common.dto.product.response;

import com.example.persistence.enumTable.ProducType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetProductsRes {
    private String        productId;

    private String        productName;

    private String        productCode;

    private BigDecimal    productPrice;

    private int           productQuantity;

    private boolean       isLowStock;

    private ProducType productType;

    private List<String>  productImage;

    private String        supplierName;

    private String        categoryName;

    private PaintDetailDto    paintDetail;

    private ToolDetailDto     toolDetail;

    private ChemicalDetailDto chemicalDetail;
}
