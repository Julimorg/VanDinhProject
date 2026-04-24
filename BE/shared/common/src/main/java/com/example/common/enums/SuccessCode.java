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
    REFRESH_TOKEN_SUCCESSFULLY("Refresh Token Successfully!", HttpStatus.OK),

    // ======================= USER =======================
    GET_USER_SELECTION("Successfully!", HttpStatus.OK),
    GET_USER("Get User Successfully!", HttpStatus.OK),
    GET_USER_PROFILE_DETAIL("Get User Profile Detail Successfully!", HttpStatus.OK),
    GET_MY_PROFILE("Get My Profile Successfully!", HttpStatus.OK),
    CREATE_USER("Create User Successfully!", HttpStatus.OK),
    UPDATE_MY_PROFILE("Update Profile Successfully!", HttpStatus.OK),
    UPDATE_USER_PROFILE("Update User Profile Successfully!", HttpStatus.OK),

    // ======================= SUPPLIER =======================
    GET_SUPPLIER_SELECTION("Successfully!", HttpStatus.OK),
    GET_SUPPLIER("Get Supplier Successfully!", HttpStatus.OK),
    GET_SUPPLIER_DETAIL("Get Supplier Detail Successfully!", HttpStatus.OK),
    CREATE_SUPPLIER("Create Supplier Successfully!", HttpStatus.OK),
    UPDATE_SUPPLIER("Update Supplier Successfully!", HttpStatus.OK),
    DELETE_SUPPLIER("Delete Supplier Successfully!", HttpStatus.OK),

    // ======================= CATEGORY =======================
    CREATE_CATEGORY("Create Category Successfully! ", HttpStatus.OK),
    UPDATE_CATEGORY("Update Category Successfully! ", HttpStatus.OK),
    GET_CATEGORY_SELECTION("Get Category Selection Successfully! ", HttpStatus.OK),
    GET_CATEGORY_DETAIL("Get Category Detail Successfully! ", HttpStatus.OK),
    GET_CATEGORY("Get Category Successfully! ", HttpStatus.OK),
    DELETE_CATEGORY("Delete Category Successfully! ", HttpStatus.OK);


    private final String message;
    private final HttpStatusCode statusCode;

    SuccessCode(String message, HttpStatusCode statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
