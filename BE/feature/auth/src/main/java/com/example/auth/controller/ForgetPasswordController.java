package com.example.auth.controller;
import com.example.auth.service.ForgotPassService;
import com.example.common.dto.auth.request.ChangePasswordReq;
import com.example.common.dto.auth.request.VerifyOtp;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("api/v1/reset-pass")
@RequiredArgsConstructor
public class ForgetPasswordController {

    private final ForgotPassService forgetPassService;

    @PostMapping("/verify-email/{email}")
    public ApiResponse<String> verifyEmail(@PathVariable("email") String email) throws Exception {

        forgetPassService.sendOtp(email);

        return ApiResponse.<String>builder()
                .status_code(SuccessCode.SEND_OTP.getStatusCode().value())
                .message(SuccessCode.SEND_OTP.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
    }



    @PostMapping("/verify-otp/{email}")
    public ApiResponse<String> verifyOtp(@RequestBody VerifyOtp otp,
                                         @PathVariable("email") String email){
        forgetPassService.verifyOtp(email, otp);
        return ApiResponse
                .<String>builder()
                .status_code(SuccessCode.OTP_VERIFIED.getStatusCode().value())
                .message(SuccessCode.OTP_VERIFIED.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PatchMapping("/change-password/{email}")
    public ApiResponse<String> changePasswordHandler(@RequestBody @Valid ChangePasswordReq changePassword,
                                                     @PathVariable("email") String email){
        forgetPassService.changePassword(changePassword, email);

        return ApiResponse
                .<String>builder()
                .status_code(HttpStatus.OK.value())
                .message("Update password successfully!")
                .timestamp(LocalDateTime.now())
                .build();
    }
}
