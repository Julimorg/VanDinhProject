package com.example.common.dto.supplier.response;



import com.example.common.dto.color.response.GetAlbumWithColorRes;
import com.example.common.dto.color.response.GetColorSummaryRes;
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
public class GetSupplierDetailRes {

    private String supplierId;
    private String supplierName;
    private String supplierAddress;
    private String supplierPhone;
    private String supplierEmail;
    private String supplierImg;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

}
