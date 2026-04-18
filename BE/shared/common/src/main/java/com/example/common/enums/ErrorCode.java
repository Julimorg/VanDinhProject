package com.example.common.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {

    // ======================= AUTH =======================
    UNAUTHENTICATED("Unauthenticated! Please Login To Continue!", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("Wrong Password or UserName! Please Check Again!", HttpStatus.UNAUTHORIZED),
    BANNED("You have been banned!", HttpStatus.FORBIDDEN),
    INVALID_TOKEN("Invalid Token!", HttpStatus.UNAUTHORIZED),

    // ======================= USER =======================
    USER_EXISTED("User Existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID("Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    USER_PASSWORD_INVALID("UserPassword must be at least 3 characters", HttpStatus.BAD_REQUEST),
    USER_FIRSTNAME_INVALID("UserFirstName must be at least 3 characters", HttpStatus.BAD_REQUEST),
    USER_LASTNAME_INVALID("UserLastName must be at least 3 characters", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID("Invalid Email Format", HttpStatus.BAD_REQUEST),
    PHONE_INVALID("Invalid Phone Number", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED("User Not Existed", HttpStatus.BAD_REQUEST),
    EMAIl_EXISTED("Email Existed", HttpStatus.BAD_REQUEST),

    // ======================= ROLE =======================
    ROLE_NOT_FOUND("Role Not Found", HttpStatus.NOT_FOUND),

    // ======================= PRODUCT =======================
    PRODUCT_EXISTED("Product Existed", HttpStatus.BAD_REQUEST),
    PRODUCT_EXCEED_LIMIT("Product Quantity is too high", HttpStatus.BAD_REQUEST),

    // ======================= SUPPLIER =======================
    SUPPLIER_NOT_EXISTED("Supplier Not Existed", HttpStatus.BAD_REQUEST),

    // ======================= COLOR =======================
    COLOR_NOT_EXISTED("Color Not Existed", HttpStatus.BAD_REQUEST),

    // ======================= CATEGORY =======================
    CATEGORY_NOT_EXISTED("Category Not Existed", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTED("Category Existed", HttpStatus.BAD_REQUEST),

    // ======================= CLOUDINARY =======================
    IMG_OVER_SIZE("Your Image is over size!", HttpStatus.BAD_REQUEST),

    // ======================= UNKNOWN =======================
    UNKNOWN_ERROR("Unknown Error", HttpStatus.INTERNAL_SERVER_ERROR),
    WRONG_PATH("Wrong Path", HttpStatus.BAD_REQUEST),
    ;

    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(String message, HttpStatusCode statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}