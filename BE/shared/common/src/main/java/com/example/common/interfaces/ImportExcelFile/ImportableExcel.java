package com.example.common.interfaces.ImportExcelFile;

import com.example.common.dto.ImportExcelFile.Request.ImportColumnReq;

import java.util.List;
import java.util.Map;

public interface ImportableExcel<T> {

    List<ImportColumnReq> getColumns();

    T mapRow(Map<String, String> rawRow, int rowNumber);

    List<String> validateRow(T data, int rowNumber);

    void saveAll(List<T> validData);

    default String getSheetName() {
        return "Sheet1";
    }

}
