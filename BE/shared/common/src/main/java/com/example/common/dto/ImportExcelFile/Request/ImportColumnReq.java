package com.example.common.dto.ImportExcelFile.Request;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ImportColumnReq {

    private String field;

    private String header;

    private boolean required;

    private String note;

    private String sample;

    private List<String> options;

}
