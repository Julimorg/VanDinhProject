package com.example.common.dto.color.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportColorRes {

    private int totalRows;
    private int successCount;
    private boolean success;
    private List<String> errors;

}
