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
                    .message("Payment Successfully!")
                    .timestamp(LocalDateTime.now())
                    .build();
            case 0 -> ApiResponse.<String>builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Payment failed!")
                    .timestamp(LocalDateTime.now())
                    .build();
            default -> ApiResponse.<String>
                            builder()
                    .status_code(HttpStatus.OK.value())
                    .message("Wrong signature! Fake!")
                    .timestamp(LocalDateTime.now())
                    .build();
        };
    }
 }

