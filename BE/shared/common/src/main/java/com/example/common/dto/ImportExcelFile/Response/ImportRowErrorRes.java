package com.example.common.dto.ImportExcelFile.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportRowErrorRes {

    private int rowNumber;

    private List<String> messages;

}
