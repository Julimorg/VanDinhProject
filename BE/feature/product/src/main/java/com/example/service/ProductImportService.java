package com.example.service;

import com.example.common.dto.ImportExcelFile.Request.ImportColumnReq;
import com.example.common.dto.product.request.CreateProductReq;
import com.example.common.dto.product.request.ProductExcelRow;
import com.example.common.interfaces.ImportExcelFile.ImportableExcel;
import com.example.persistence.enumTable.ProducType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductImportService implements ImportableExcel<ProductExcelRow> {

    private final ProductService productService;
    @Override
    public List<ImportColumnReq> getColumns() {
        return List.of(
                ImportColumnReq.builder().field("productName").header("Tên sản phẩm").required(true)
                        .note("Tên hiển thị của sản phẩm").sample("Sơn nước ngoại thất cao cấp").build(),
                ImportColumnReq.builder().field("productCode").header("Mã sản phẩm").required(true)
                        .note("Mã duy nhất, không được trùng với sản phẩm đã có").sample("SP-001").build(),
                ImportColumnReq.builder().field("productPrice").header("Giá").required(true)
                        .note("Đơn vị VNĐ, phải lớn hơn 0").sample("150000").build(),
                ImportColumnReq.builder().field("productQuantity").header("Số lượng").required(true)
                        .note("Số nguyên, từ 1 đến 10.000.000").sample("100").build(),
                ImportColumnReq.builder().field("productType").header("Loại sản phẩm (PAINT/TOOL/CHEMICAL)").required(true)
                        .note("Chọn từ danh sách sổ xuống").sample("PAINT")
                        .options(List.of("PAINT", "TOOL", "CHEMICAL")).build(),
                ImportColumnReq.builder().field("supplierId").header("Mã nhà cung cấp").required(true)
                        .note("Lấy mã tại màn hình Quản lý nhà cung cấp").sample("supplier-id-here").build(),
                ImportColumnReq.builder().field("categoryId").header("Mã danh mục").required(false)
                        .note("Lấy mã tại màn hình Quản lý danh mục").sample("category-id-here").build(),
                ImportColumnReq.builder().field("productDescription").header("Mô tả").required(false)
                        .sample("Sơn bền màu, chống thấm tốt").build(),
                ImportColumnReq.builder().field("discount").header("Giảm giá (%)").required(false)
                        .note("Từ 0 đến 100").sample("10").build(),
                ImportColumnReq.builder().field("colorId").header("Mã màu (Paint)").required(false)
                        .note("Bắt buộc nếu Loại sản phẩm = PAINT").sample("color-id-here").build(),
                ImportColumnReq.builder().field("surfaceType").header("Bề mặt (Paint)").required(false)
                        .note("Bắt buộc nếu Loại sản phẩm = PAINT").sample("Mịn").build(),
                ImportColumnReq.builder().field("volume").header("Dung tích (Paint)").required(false)
                        .note("Bắt buộc nếu Loại sản phẩm = PAINT").sample("5L").build(),
                ImportColumnReq.builder().field("toolType").header("Loại dụng cụ (Tool)").required(false)
                        .note("Bắt buộc nếu Loại sản phẩm = TOOL").sample("Cọ sơn").build(),
                ImportColumnReq.builder().field("toolSize").header("Kích thước (Tool)").required(false)
                        .sample("5cm").build(),
                ImportColumnReq.builder().field("chemicalType").header("Loại hóa chất (Chemical)").required(false)
                        .note("Bắt buộc nếu Loại sản phẩm = CHEMICAL").sample("Dung môi pha sơn").build(),
                ImportColumnReq.builder().field("chemicalVolume").header("Dung tích hóa chất (Chemical)").required(false)
                        .sample("1L").build(),
                ImportColumnReq.builder().field("extraSpecs").header("Thông số thêm (JSON)").required(false)
                        .note("Định dạng JSON, ví dụ: {\"key\":\"value\"}. Bỏ trống nếu không có").build()
        );
    }

    @Override
    public ProductExcelRow mapRow(Map<String, String> rawRow, int rowNumber) {
        return ProductExcelRow.builder()
                .productName(rawRow.get("Tên sản phẩm"))
                .productCode(rawRow.get("Mã sản phẩm"))
                .productPrice(parseBigDecimal(rawRow.get("Giá")))
                .productQuantity(parseInt(rawRow.get("Số lượng")))
                .productType(parseProductType(rawRow.get("Loại sản phẩm (PAINT/TOOL/CHEMICAL)")))
                .supplierId(rawRow.get("Mã nhà cung cấp"))
                .categoryId(rawRow.get("Mã danh mục"))
                .productDescription(rawRow.get("Mô tả"))
                .discount(parseDouble(rawRow.get("Giảm giá (%)")))
                .colorId(rawRow.get("Mã màu (Paint)"))
                .surfaceType(rawRow.get("Bề mặt (Paint)"))
                .volume(rawRow.get("Dung tích (Paint)"))
                .toolType(rawRow.get("Loại dụng cụ (Tool)"))
                .toolSize(rawRow.get("Kích thước (Tool)"))
                .chemicalType(rawRow.get("Loại hóa chất (Chemical)"))
                .chemicalVolume(rawRow.get("Dung tích hóa chất (Chemical)"))
                .extraSpecs(rawRow.get("Thông số thêm (JSON)"))
                .build();
    }

    @Override
    public List<String> validateRow(ProductExcelRow row, int rowNumber) {
        List<String> errors = new ArrayList<>();

        if (!StringUtils.hasText(row.getProductName())) errors.add("Tên sản phẩm không được trống");
        if (!StringUtils.hasText(row.getProductCode())) errors.add("Mã sản phẩm không được trống");
        if (row.getProductPrice() == null || row.getProductPrice().compareTo(BigDecimal.ZERO) <= 0)
            errors.add("Giá phải lớn hơn 0");
        if (row.getProductQuantity() <= 0 || row.getProductQuantity() > 10_000_000)
            errors.add("Số lượng phải > 0 và <= 10.000.000");
        if (row.getProductType() == null) errors.add("Loại sản phẩm không hợp lệ (PAINT/TOOL/CHEMICAL)");
        if (!StringUtils.hasText(row.getSupplierId())) errors.add("Mã nhà cung cấp không được trống");

        if (row.getProductType() != null) {
            switch (row.getProductType()) {
                case PAINT -> {
                    if (!StringUtils.hasText(row.getColorId())) errors.add("colorId: Màu sơn không được trống");
                    if (!StringUtils.hasText(row.getSurfaceType())) errors.add("surfaceType: Bề mặt không được trống");
                    if (!StringUtils.hasText(row.getVolume())) errors.add("volume: Dung tích không được trống");
                }
                case TOOL -> {
                    if (!StringUtils.hasText(row.getToolType())) errors.add("toolType: Loại dụng cụ không được trống");
                }
                case CHEMICAL -> {
                    if (!StringUtils.hasText(row.getChemicalType())) errors.add("chemicalType: Loại hóa chất không được trống");
                }
            }
        }

        return errors;
    }

    @Override
    public void saveAll(List<ProductExcelRow> validData) {
        Set<String> codesInFile = new HashSet<>();

        for (ProductExcelRow row : validData) {
            if (!codesInFile.add(row.getProductCode())) {
                throw new RuntimeException("Mã sản phẩm bị trùng trong file: " + row.getProductCode());
            }
            productService.createProduct(toCreateProductReq(row));
        }
    }

    private CreateProductReq toCreateProductReq(ProductExcelRow row) {
        return CreateProductReq.builder()
                .productName(row.getProductName())
                .productCode(row.getProductCode())
                .productPrice(row.getProductPrice())
                .productQuantity(row.getProductQuantity())
                .productType(row.getProductType())
                .supplierId(row.getSupplierId())
                .categoryId(row.getCategoryId())
                .productDescription(row.getProductDescription())
                .discount(row.getDiscount())
                .colorId(row.getColorId())
                .surfaceType(row.getSurfaceType())
                .volume(row.getVolume())
                .toolType(row.getToolType())
                .toolSize(row.getToolSize())
                .chemicalType(row.getChemicalType())
                .chemicalVolume(row.getChemicalVolume())
                .extraSpecs(row.getExtraSpecs())
                .build();
    }

    private BigDecimal parseBigDecimal(String value) {
        if (!StringUtils.hasText(value)) return null;
        try {
            return new BigDecimal(value.trim().replace(",", ""));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private int parseInt(String value) {
        if (!StringUtils.hasText(value)) return 0;
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private double parseDouble(String value) {
        if (!StringUtils.hasText(value)) return 0;
        try {
            return Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private ProducType parseProductType(String value) {
        if (!StringUtils.hasText(value)) return null;
        try {
            return ProducType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
