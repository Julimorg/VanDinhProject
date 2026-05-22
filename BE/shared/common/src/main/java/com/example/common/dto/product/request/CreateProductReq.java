package com.example.common.dto.product.request;

import com.example.common.annotationCustome.ValidProductTypeFields;
import com.example.persistence.enumTable.ProducType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ValidProductTypeFields
@Builder
public class CreateProductReq {

    @NotBlank(message = "Tên sản phẩm không được trống")
    private String productName;

    @NotBlank(message = "Mã sản phẩm không được trống")
    private String productCode;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    private BigDecimal productPrice;

    @Min(value = 0, message = "Số lượng không được âm")
    private int productQuantity;

    @NotNull(message = "Loại sản phẩm không được trống")
    private ProducType productType;

    @NotBlank(message = "Nhà cung cấp không được trống")
    private String supplierId;

    private String categoryId;

    private String productDescription;

    private double discount;

    private MultipartFile[] productImage;

    // ── Paint fields ──────
    private String colorId;
    private String surfaceType;
    private String volume;

    // ── Tool fields────────
    private String toolType;
    private String toolSize;

    // ── Chemical fields
    private String chemicalType;
    private String chemicalVolume;

    // ── Extra specs  ───────────
    private String extraSpecs;

}
