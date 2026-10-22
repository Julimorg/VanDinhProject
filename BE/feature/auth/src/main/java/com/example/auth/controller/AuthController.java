package com.example.auth.controller;
import com.example.auth.service.AuthService;
import com.example.common.dto.auth.request.IntrospectRequest;
import com.example.common.dto.auth.request.LogOutReq;
import com.example.common.dto.auth.request.LoginReq;
import com.example.common.dto.auth.request.SignUpReq;
import com.example.common.dto.auth.response.IntrospectResponse;
import com.example.common.dto.auth.response.LoginRes;
import com.example.common.dto.auth.response.RefreshRes;
import com.example.common.dto.auth.response.SignUpUserRes;
import com.example.common.enums.SuccessCode;
import com.example.common.response.ApiResponse;
import com.example.security.jwt.AuthCookieNames;
import com.nimbusds.jose.JOSEException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authenticationService;

    // Cung TTL voi JWT (xem JwtService) de cookie het han cung luc token het han.
    @Value("${expiry.date}")
    private long accessTokenExpirySeconds;

    @Value("${refreshable.duration}")
    private long refreshTokenExpirySeconds;

    // Prod (FE/BE khac domain, deploy qua HTTPS): set COOKIE_SECURE=true, COOKIE_SAME_SITE=None.
    // Dev (localhost, http): gia tri mac dinh ben duoi la dung, khong can chinh gi.
    @Value("${cookie.secure:false}")
    private boolean cookieSecure;

    @Value("${cookie.same-site:Lax}")
    private String cookieSameSite;

    /**
     * Set 2 cookie httpOnly cho web client (USER app). ADMIN/Mobile khong doc cookie
     * nen khong bi anh huong - van dung accessToken/refreshToken tra ve trong body nhu cu.
     */
    private void setAuthCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        if (accessToken != null) {
            response.addHeader(HttpHeaders.SET_COOKIE, buildCookie(
                    AuthCookieNames.ACCESS_TOKEN, accessToken, accessTokenExpirySeconds).toString());
        }
        if (refreshToken != null) {
            response.addHeader(HttpHeaders.SET_COOKIE, buildCookie(
                    AuthCookieNames.REFRESH_TOKEN, refreshToken, refreshTokenExpirySeconds).toString());
        }
    }

    private void clearAuthCookies(HttpServletResponse response) {
        response.addHeader(HttpHeaders.SET_COOKIE, buildCookie(AuthCookieNames.ACCESS_TOKEN, "", 0).toString());
        response.addHeader(HttpHeaders.SET_COOKIE, buildCookie(AuthCookieNames.REFRESH_TOKEN, "", 0).toString());
    }

    private ResponseCookie buildCookie(String name, String value, long maxAgeSeconds) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/")
                .maxAge(maxAgeSeconds)
                .build();
    }

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
    ApiResponse<LoginRes> login(@RequestBody LoginReq request, HttpServletResponse response){
        var result = authenticationService.login(request);

        // Cookie httpOnly cho USER app; body van tra ve day du nhu cu cho ADMIN/Mobile.
        setAuthCookies(response, result.getAccessToken(), result.getRefreshToken());

        return ApiResponse.<LoginRes>builder()
                .status_code(SuccessCode.LOGIN_SUCCESSFULLY.getStatusCode().value())
                .message(SuccessCode.LOGIN_SUCCESSFULLY.getMessage())
                .data(result)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PostMapping("/log-out")
    ApiResponse<String> logout(@RequestBody LogOutReq request, HttpServletResponse response)
            throws ParseException, JOSEException {

        authenticationService.logOut(request);
        clearAuthCookies(response);
        return ApiResponse.<String>builder()
                .status_code(SuccessCode.LOG_OUT_SUCCESSFULLY.getStatusCode().value())
                .message(SuccessCode.LOG_OUT_SUCCESSFULLY.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
    }


    @GetMapping("/refresh-token")
    ApiResponse<RefreshRes> refreshToken(@RequestHeader("Authorization") String authToken,
                                          HttpServletResponse response)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(authToken);

        setAuthCookies(response, result.getAccessToken(), null);

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
