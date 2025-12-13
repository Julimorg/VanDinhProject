package com.example.managementapi.Controller;


import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Order.ExportFileReq;
import com.example.managementapi.Dto.Response.Order.GetUserOrdersDetailRes;
import com.example.managementapi.Service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/file")
public class FileExportController {

    private final OrderService orderService;

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
