package com.example.managementapi.Controller;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Service.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("api/v1/vn-pay")
@RequiredArgsConstructor
public class VnPayController {

    private final VnPayService vnPayService;

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

