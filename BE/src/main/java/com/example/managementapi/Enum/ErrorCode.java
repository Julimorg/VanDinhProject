package com.example.managementapi.Enum;


import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    //* ======================= AUTH CATCH ERROR 5000 =======================
    UNAUTHENTICATED("UnAuthenticated! Please Log in to continue!", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("Unauthorized", HttpStatus.UNAUTHORIZED),
    BANNED("You have been banned! ", HttpStatus.FORBIDDEN),

    //* ======================= USER CATCH ERROR 1100 =======================

    USER_EXISTED("User Existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID("Username must be at least 3 characters", HttpStatus.BAD_REQUEST),
    USER_PASSWORD_INVALID("UserPassword must be at least 3 characters", HttpStatus.BAD_REQUEST),
    USER_FIRSTNAME_INVALID( "UserFirstName must be at least 3 characters", HttpStatus.BAD_REQUEST),
    USER_LASTNAME_INVALID("UserLastName must be at least 3 characters", HttpStatus.BAD_REQUEST),
    EMAIL_INVALID( "Invalid Email Format", HttpStatus.BAD_REQUEST),
    PHONE_INVALID("Invalid Phone Number", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED ("User Not Existed", HttpStatus.BAD_REQUEST),

    //* ======================= PRODUCT CATCH ERROR 1200 =======================

    PRODUCT_EXISTED("Product Existed", HttpStatus.BAD_REQUEST),
    PRODUCT_EXCEED_LIMIT("Product Quantity is too high", HttpStatus.BAD_REQUEST ),

    //* ======================= SUPPLIER CATCH ERROR 1300 =======================
    SUPPLIER_NOT_EXISTED("Supplier Not Existed", HttpStatus.BAD_REQUEST),

    //* ======================= COLOR CATCH ERROR 1400 =======================
    COLOR_NOT_EXISTED( "Color Not Existed", HttpStatus.BAD_REQUEST),

    //* ======================= CATEGORY CATCH ERROR 1500 =======================

    CATEGORY_NOT_EXISTED("Category Not Existed", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTED("Category Existed", HttpStatus.BAD_REQUEST),

    //* ======================= CLOUDINARY CATCH ERROR 3000 =======================
    IMG_OVER_SIZE("Your Image is over size!", HttpStatus.BAD_REQUEST),

    //* ======================= UNKNOWN CATCH ERROR 9000 =======================

    UNKNOWN_ERROR("Unknown Error", HttpStatus.INTERNAL_SERVER_ERROR),
    WRONG_PATH( "Wrong Path", HttpStatus.BAD_REQUEST),

    ;

    private int code;
    private String message;
    private HttpStatusCode statusCode;

    ErrorCode(String message, HttpStatusCode statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }

}
