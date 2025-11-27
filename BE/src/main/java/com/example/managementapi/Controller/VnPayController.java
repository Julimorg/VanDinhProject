package com.example.managementapi.Controller;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Service.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("api/v1/vn-pay")
@RequiredArgsConstructor
@Slf4j
public class VnPayController {

    private final VnPayService vnPayService;

    @GetMapping("/return")
    public ApiResponse<Map<String, String>> paymentReturnUrl(HttpServletRequest request) {

        Map<String, String> result = vnPayService.handleReturn(request);

        boolean success = "true".equals(result.get("success"));

        if (success) {
            log.info("RETURN URL: Thanh toán thành công đơn {}", result.get("orderId"));
        } else {
            log.warn("RETURN URL: Thanh toán thất bại hoặc bị fake - đơn {}", result.get("orderId"));
        }

        return ApiResponse.<Map<String, String>>builder()
                .status_code(success ? 200 : 400)
                .message(result.get("message"))
                .data(result)
                .timestamp(LocalDateTime.now())
                .build();

    }

    // ==================================================================
    // 3. IPN URL – VNPAY gọi NGẦM (quan trọng nhất – cập nhật DB thật sự)
    // ==================================================================
    @PostMapping("/vnpay-ipn")
    public ApiResponse<String> paymentIpn(HttpServletRequest request) {

        Map<String, String> fields = new java.util.HashMap<>();
        request.getParameterMap().forEach((k, v) -> fields.put(k, v[0]));

        Map<String, String> ipnResult = vnPayService.handleIpn(fields);

        String rspCode = ipnResult.get("RspCode");
        String message = ipnResult.get("Message");

        if ("00".equals(rspCode)) {
            log.info("IPN: Xác nhận thanh toán THÀNH CÔNG từ VNPAY - RspCode: {}", rspCode);
        } else {
            log.warn("IPN: VNPAY báo lỗi - RspCode: {}, Message: {}", rspCode, message);
        }


        return ApiResponse.<String>builder()
                .status_code("00".equals(rspCode) ? 200 : 400)
                .message(message)
                .data(rspCode)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/vnpay-return")
    public ApiResponse<String> paymentReturn(HttpServletRequest request) {
        int result = vnPayService.orderReturn(request);
        return switch (result) {
            case 1 -> ApiResponse.<String>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Payment successfully!")
                    .timestamp(LocalDateTime.now())
                    .build();
            case 2 -> ApiResponse.<String>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Transaction not yet completed")
                    .timestamp(LocalDateTime.now())
                    .build();
            case 3 -> ApiResponse.<String>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Transaction failed")
                    .timestamp(LocalDateTime.now())
                    .build();
            case 4 -> ApiResponse.<String>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Transaction reversed")
                    .timestamp(LocalDateTime.now())
                    .build();
            case 5 -> ApiResponse.<String>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("VNPAY is processing refund")
                    .timestamp(LocalDateTime.now())
                    .build();
            case 6 -> ApiResponse.<String>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Refund request sent to bank")
                    .timestamp(LocalDateTime.now())
                    .build();
            case 7 -> ApiResponse.<String>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Transaction suspected as fraud")
                    .timestamp(LocalDateTime.now())
                    .build();
            case 8 -> ApiResponse.<String>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Refund denied")
                    .timestamp(LocalDateTime.now())
                    .build();
            case -1 -> ApiResponse.<String>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Wrong signature! Fake!")
                    .timestamp(LocalDateTime.now())
                    .build();
            default -> ApiResponse.<String>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Unknown transaction status")
                    .timestamp(LocalDateTime.now())
                    .build();
        };
    }
 }

