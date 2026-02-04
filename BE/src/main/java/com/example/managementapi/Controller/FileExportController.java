package com.example.managementapi.Controller;
import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Order.ExportFileReq;
import com.example.managementapi.Entity.Product;
import com.example.managementapi.Service.FileService;
import com.example.managementapi.Service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/file")
public class FileExportController {

    private final OrderService orderService;

    private final FileService fileService;

    @PostMapping("/excel-file")
    public ResponseEntity<byte[]> exportExcelFile(@RequestBody ExportFileReq req) throws IOException {

        byte[] excelBytes = orderService.exportExcelFileByGetOrdersFromUserAndDateRange(req);

        String fileName = "BaoCaoDonHang_VanDinh_" + req.getStartDate() + "_den_" + req.getEndDate() + ".xlsx";

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(fileName, StandardCharsets.UTF_8)
                .build());
        headers.setContentLength(excelBytes.length);

        return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
    }
    @PostMapping("/import")
    public ApiResponse<Map<String, Object>> importProducts(
            @RequestParam("file") MultipartFile file) {

        // Validate file empty
        if (file.isEmpty()) {
            return ApiResponse.<Map<String, Object>>builder()
                    .status_code(HttpStatus.BAD_REQUEST.value())
                    .message("File CSV trống!")
                    .data(null)
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        // Validate file type
        if (!file.getOriginalFilename().endsWith(".csv")) {
            return ApiResponse.<Map<String, Object>>builder()
                    .status_code(HttpStatus.BAD_REQUEST.value())
                    .message("Chỉ chấp nhận file CSV!")
                    .data(null)
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        try {
            List<Product> products = fileService.importProductsFromCsv(file);

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("total_imported", products.size());
            responseData.put("products", products);
            responseData.put("file_name", file.getOriginalFilename());

            return ApiResponse.<Map<String, Object>>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Import thành công " + products.size() + " sản phẩm!")
                    .data(responseData)
                    .timestamp(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            return ApiResponse.<Map<String, Object>>builder()
                    .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Lỗi khi import: " + e.getMessage())
                    .data(null)
                    .timestamp(LocalDateTime.now())
                    .build();
        }
    }

    // Download tất cả products ra CSV (trả về base64)
    @GetMapping("/export")
    public ApiResponse<Map<String, Object>> exportAllProducts() {
        try {
            Map<String, Object> exportData = fileService.exportProductsToCsvBase64();

            return ApiResponse.<Map<String, Object>>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Export CSV thành công!")
                    .data(exportData)
                    .timestamp(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            return ApiResponse.<Map<String, Object>>builder()
                    .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Lỗi khi export CSV: " + e.getMessage())
                    .data(null)
                    .timestamp(LocalDateTime.now())
                    .build();
        }
    }

    // Get template CSV để import
    @GetMapping("/template")
    public ApiResponse<Map<String, Object>> downloadTemplate() {
        try {
            Map<String, Object> templateData = fileService.generateCsvTemplateBase64();

            return ApiResponse.<Map<String, Object>>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Tạo template CSV thành công!")
                    .data(templateData)
                    .timestamp(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            return ApiResponse.<Map<String, Object>>builder()
                    .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Lỗi khi tạo template: " + e.getMessage())
                    .data(null)
                    .timestamp(LocalDateTime.now())
                    .build();
        }
    }

    // Validate CSV trước khi import
    @PostMapping("/validate")
    public ApiResponse<Map<String, Object>> validateCsv(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ApiResponse.<Map<String, Object>>builder()
                    .status_code(HttpStatus.BAD_REQUEST.value())
                    .message("File CSV trống!")
                    .data(null)
                    .timestamp(LocalDateTime.now())
                    .build();
        }

        try {
            Map<String, Object> validationResult = fileService.validateCsvFile(file);

            boolean isValid = (boolean) validationResult.get("is_valid");

            if (isValid) {
                return ApiResponse.<Map<String, Object>>builder()
                        .status_code(HttpStatus.OK.value())
                        .message("File CSV hợp lệ!")
                        .data(validationResult)
                        .timestamp(LocalDateTime.now())
                        .build();
            } else {
                return ApiResponse.<Map<String, Object>>builder()
                        .status_code(HttpStatus.BAD_REQUEST.value())
                        .message("File CSV có lỗi!")
                        .data(validationResult)
                        .timestamp(LocalDateTime.now())
                        .build();
            }

        } catch (Exception e) {
            return ApiResponse.<Map<String, Object>>builder()
                    .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Lỗi khi validate CSV: " + e.getMessage())
                    .data(null)
                    .timestamp(LocalDateTime.now())
                    .build();
        }
    }

//    @PostMapping("/excel-file")
//    public ApiResponse<byte[]> exportExcelFileByGetOrdersFromUserAndDateRange(@RequestBody ExportFileReq req) throws IOException {
//
//        byte[] excelBytes = orderService.exportExcelFileByGetOrdersFromUserAndDateRange(req);
//
//        //? Tên file
//        String fileName = "BaoCaoDonHang_VanDinh_" + req.getStartDate() + "_den_" + req.getEndDate() + ".xlsx";
//
//        //? Set headers
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//
//        headers.setContentDisposition(ContentDisposition.attachment()
//                .filename(fileName, StandardCharsets.UTF_8)
//                .build());
//        headers.setContentLength(excelBytes.length);
//
//        return ApiResponse.<byte[]>builder()
//                .status_code(HttpStatus.OK.value())
//                .message("Export Successfully !")
//                .data(excelBytes)
//                .timestamp(LocalDateTime.now())
//                .build();
//    }

}
