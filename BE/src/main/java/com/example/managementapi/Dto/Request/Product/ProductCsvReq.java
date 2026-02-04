package com.example.managementapi.Dto.Request.Product;

import com.opencsv.bean.CsvBindByName;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductCsvReq {

    @CsvBindByName(column = "Product ID")
    private String productId;

    @CsvBindByName(column = "Product Name")
    private String productName;

    @CsvBindByName(column = "Description")
    private String productDescription;

    @CsvBindByName(column = "Images")
    private String productImages;

    @CsvBindByName(column = "Volume")
    private String productVolume;

    @CsvBindByName(column = "Unit")
    private String productUnit;

    @CsvBindByName(column = "Product Code")
    private String productCode;

    @CsvBindByName(column = "Quantity")
    private int productQuantity;

    @CsvBindByName(column = "Discount")
    private double discount;

    @CsvBindByName(column = "Price")
    private BigDecimal productPrice;

    @CsvBindByName(column = "Supplier ID")
    private String supplierId;

    @CsvBindByName(column = "Supplier Name")
    private String supplierName;

    @CsvBindByName(column = "Color ID")
    private String colorId;

    @CsvBindByName(column = "Color Name")
    private String colorName;

    @CsvBindByName(column = "Category ID")
    private String categoryId;

    @CsvBindByName(column = "Category Name")
    private String categoryName;
}