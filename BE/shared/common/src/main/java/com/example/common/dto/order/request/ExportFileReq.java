package com.example.common.dto.order.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExportFileReq {
    private String userId;
    private String startDate;
    private String endDate;
}
