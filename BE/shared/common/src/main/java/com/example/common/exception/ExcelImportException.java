package com.example.common.exception;

import com.example.common.dto.ImportExcelFile.Response.ImportRowErrorRes;
import lombok.Getter;

import java.util.List;

@Getter
public class ExcelImportException extends RuntimeException {

    private final List<ImportRowErrorRes> errors;

    public ExcelImportException(List<ImportRowErrorRes>  errors) {
        super("Import Excel thất bại: " + errors.size() + " dòng bị lỗi");
        this.errors = errors;
    }
}
