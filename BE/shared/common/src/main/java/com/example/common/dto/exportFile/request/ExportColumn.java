package com.example.common.dto.exportFile.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExportColumn {
    String field;
    String header;
    int index;

}
