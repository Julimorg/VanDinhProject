package com.example.auth.controller;

import com.example.auth.domain.dto.request.IntrospectRequest;
import com.example.auth.domain.dto.request.LogOutReq;
import com.example.auth.domain.dto.request.LoginReq;
import com.example.auth.domain.dto.request.SignUpReq;
import com.example.auth.domain.dto.response.IntrospectResponse;
import com.example.auth.domain.dto.response.LoginRes;
import com.example.auth.domain.dto.response.RefreshRes;
import com.example.auth.domain.dto.response.SignUpUserRes;
import com.example.auth.service.AuthService;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authenticationService;

    @PostMapping("/sign-up")
    ApiResponse<SignUpUserRes> signUp(@RequestBody @Valid SignUpReq request){

        return ApiResponse.<SignUpUserRes>builder()
                .status_code(SuccessCode.SIGN_UP_SUCCESSFULLY.getStatusCode().value())
                .message(SuccessCode.SIGN_UP_SUCCESSFULLY.getMessage())
                .data(authenticationService.signUp(request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping("/log-in")
    ApiResponse<LoginRes> login(@RequestBody LoginReq request){
        var result = authenticationService.login(request);

        return ApiResponse.<LoginRes>builder()
                .status_code(SuccessCode.LOGIN_SUCCESSFULLY.getStatusCode().value())
                .message(SuccessCode.LOGIN_SUCCESSFULLY.getMessage())
                .data(result)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping("/log-out")
    ApiResponse<String> logout(@RequestBody LogOutReq request)
            throws ParseException, JOSEException {

        authenticationService.logOut(request);
        return ApiResponse.<String>builder()
                .status_code(SuccessCode.LOG_OUT_SUCCESSFULLY.getStatusCode().value())
                .message(SuccessCode.LOG_OUT_SUCCESSFULLY.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
    }


    @GetMapping("/refresh-token")
    ApiResponse<RefreshRes> refreshToken(@RequestHeader("Authorization")  String authToken)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(authToken);

        return ApiResponse.<RefreshRes>builder()
                .status_code(SuccessCode.REFRESH_TOKEN_SUCCESSFULLY.getStatusCode().value())
                .message(SuccessCode.REFRESH_TOKEN_SUCCESSFULLY.getMessage())
                .data(result)
                .timestamp(LocalDateTime.now())
                .build();
    }


    @PostMapping("/introspect-token")
    ApiResponse<IntrospectResponse> checkVerifyToken(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);

        return ApiResponse.<IntrospectResponse>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .timestamp(LocalDateTime.now())
                .build();
    }




}
