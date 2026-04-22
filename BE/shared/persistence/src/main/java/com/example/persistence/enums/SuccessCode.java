package com.example.persistence.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum SuccessCode {

    // ======================= AUTH =======================
    LOGIN_SUCCESSFULLY("Login Successfully!", HttpStatus.OK),
    SIGN_UP_SUCCESSFULLY("SignUp Successfully!", HttpStatus.OK),
    LOG_OUT_SUCCESSFULLY("LogOut Successfully!", HttpStatus.OK),
    REFRESH_TOKEN_SUCCESSFULLY("Refresh Token Successfully!", HttpStatus.OK),

    // ======================= USER =======================
    GET_USER_SELECTION("Successfully!", HttpStatus.OK),
    GET_USER("Get User Successfully!", HttpStatus.OK),
    GET_USER_PROFILE_DETAIL("Get User Profile Detail Successfully!", HttpStatus.OK),
    GET_MY_PROFILE("Get My Profile Successfully!", HttpStatus.OK),
    CREATE_USER("Create User Successfully!", HttpStatus.OK),
    UPDATE_MY_PROFILE("Update Profile Successfully!", HttpStatus.OK),
    UPDATE_USER_PROFILE("Update User Profile Successfully!", HttpStatus.OK);

    private final String message;
    private final HttpStatusCode statusCode;

    SuccessCode(String message, HttpStatusCode statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
