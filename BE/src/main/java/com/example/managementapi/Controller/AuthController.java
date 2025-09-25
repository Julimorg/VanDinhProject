package com.example.managementapi.Controller;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Dto.Request.Auth.*;
import com.example.managementapi.Dto.Response.Auth.LoginRes;
import com.example.managementapi.Dto.Response.Auth.IntrospectResponse;
import com.example.managementapi.Dto.Response.Auth.RefreshRes;
import com.example.managementapi.Dto.Response.User.SignUpUserRes;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Service.AuthenticateService;
import com.example.managementapi.Service.UserService;
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

    private final AuthenticateService authenticationService;

    @PostMapping("/sign-up")
    ApiResponse<SignUpUserRes> signUp(@RequestBody @Valid SignUpReq request){

        return ApiResponse.<SignUpUserRes>builder()
                .status_code(HttpStatus.OK.value())
                .message("Welcome to our new client!")
                .data(authenticationService.signUp(request))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping("/log-in")
    ApiResponse<LoginRes> login(@RequestBody LoginReq request){
        var result = authenticationService.login(request);

        return ApiResponse.<LoginRes>builder()
                .status_code(HttpStatus.OK.value())
                .message("Login Paid!")
                .data(result)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping("/log-out")
    ApiResponse<String> logout(@RequestBody LogOutReq request)
            throws ParseException, JOSEException {

        authenticationService.logOut(request);
        return ApiResponse.<String>builder()
                .status_code(HttpStatus.OK.value())
                .message("Log out successfully!")
                .timestamp(LocalDateTime.now())
                .build();
    }


    @PostMapping("/refresh-token")
    ApiResponse<RefreshRes> refreshToken(@RequestBody RefreshReq request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);

        return ApiResponse.<RefreshRes>builder()
                .status_code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
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
