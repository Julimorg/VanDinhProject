package com.example.common.interfaces.exportFile;

import com.example.common.dto.exportFile.request.ExportColumn;

import java.util.List;
import java.util.Map;

public interface Exportable<T> {

    List<T> fetchData(Map<String, Object> filters);

    List<ExportColumn> getColumns();

    default String getFileName() { return "export"; }

}
