package com.example.common.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum SuccessCode {

    // ======================= AUTH =======================
    LOGIN_SUCCESSFULLY("Login Successfully!", HttpStatus.OK),
    SIGN_UP_SUCCESSFULLY("SignUp Successfully!", HttpStatus.OK),
    LOG_OUT_SUCCESSFULLY("LogOut Successfully!", HttpStatus.OK),
    REFRESH_TOKEN_SUCCESSFULLY("Refresh Token Successfully!", HttpStatus.OK);

    private final String message;
    private final HttpStatusCode statusCode;

    SuccessCode(String message, HttpStatusCode statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
