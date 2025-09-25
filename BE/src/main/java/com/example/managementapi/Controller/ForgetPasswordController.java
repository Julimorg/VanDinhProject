package com.example.managementapi.Controller;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.User.ForgetPass.ChangePassword;
import com.example.managementapi.Dto.Request.User.ForgetPass.VerifyOtp;
import com.example.managementapi.Service.ForgetPassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("api/v1/reset-pass")
@RequiredArgsConstructor
public class ForgetPasswordController {

    private final ForgetPassService forgetPassService;

    @PostMapping("/verify-email/{email}")
    public ApiResponse<String> verifyEmail(@PathVariable String email) throws Exception {

        forgetPassService.sendOtpViaEmail(email);

        return ApiResponse.<String>builder()
                .status_code(HttpStatus.OK.value())
                .message("Send Email Approved!")
                .timestamp(LocalDateTime.now())
                .build();
    }



    @PostMapping("/verify-otp/{email}")  // --> Có thể làm với Dto
    public ApiResponse<String> verifyOtp(@RequestBody VerifyOtp otp, @PathVariable String email){
        forgetPassService.verifyOtp(otp, email);
        return ApiResponse
                .<String>builder()
                .status_code(HttpStatus.OK.value())
                .message("OTP verified!")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping("/change-password/{email}")
    public ApiResponse<String> changePasswordHandler(@RequestBody ChangePassword changePassword,
                                                     @PathVariable String email){
        forgetPassService.changePasswordHandler(changePassword, email);

        return ApiResponse
                .<String>builder()
                .status_code(HttpStatus.OK.value())
                .message("Update password successfully!")
                .timestamp(LocalDateTime.now())
                .build();
    }
}
