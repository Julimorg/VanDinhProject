package com.example.common.dto.product.request;

import com.example.persistence.enumTable.ProducType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductExcelRow {

    private String productName;
    private String productCode;
    private BigDecimal productPrice;
    private int productQuantity;
    private ProducType productType;
    private String supplierId;
    private String categoryId;
    private String productDescription;
    private double discount;

    // ── Paint fields ──────
    private String colorId;
    private String surfaceType;
    private String volume;

    // ── Tool fields ───────
    private String toolType;
    private String toolSize;

    // ── Chemical fields ───
    private String chemicalType;
    private String chemicalVolume;

    private String extraSpecs;

}
