package com.example.common.enums;

import com.itextpdf.html2pdf.exceptions.Html2PdfException;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    // ======================= AUTH =======================
    UNAUTHENTICATED(
        "Unauthenticated! Please Login To Continue!",
        HttpStatus.UNAUTHORIZED
    ),
    UNAUTHORIZED(
        "Wrong Password or UserName! Please Check Again!",
        HttpStatus.UNAUTHORIZED
    ),
    BANNED("You have been banned!", HttpStatus.FORBIDDEN),
    INVALID_TOKEN("Invalid Token!", HttpStatus.UNAUTHORIZED),
    PASSWORD_MISMATCH("Password MissMatch!", HttpStatus.UNAUTHORIZED),

    // ======================= EMAIL =======================
    EMAIL_SEND_FAILED("Email Send Failed!", HttpStatus.BAD_REQUEST),
    INVALID_OTP("Invalid OTP!", HttpStatus.BAD_REQUEST),
    OTP_EXPIRED("OTP Expired!", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED("Email Existed!", HttpStatus.BAD_REQUEST),

    // ======================= USER =======================
    USER_EXISTED("User Existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(
        "Username must be at least 3 characters",
        HttpStatus.BAD_REQUEST
    ),
    USER_PASSWORD_INVALID(
        "UserPassword must be at least 3 characters",
        HttpStatus.BAD_REQUEST
    ),
    USER_FIRSTNAME_INVALID(
        "UserFirstName must be at least 3 characters",
        HttpStatus.BAD_REQUEST
    ),
    USER_LASTNAME_INVALID(
        "UserLastName must be at least 3 characters",
        HttpStatus.BAD_REQUEST
    ),
    EMAIL_INVALID("Invalid Email Format", HttpStatus.BAD_REQUEST),
    PHONE_INVALID("Invalid Phone Number", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED("User Not Existed", HttpStatus.NOT_FOUND),
    EMAIl_EXISTED("Email Existed", HttpStatus.BAD_REQUEST),
    EMAIL_NOT_FOUND("Email Not Found", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND("User Not Found", HttpStatus.NOT_FOUND),

    // ======================= ROLE =======================
    ROLE_NOT_FOUND("Role Not Found", HttpStatus.NOT_FOUND),

    // ======================= PRODUCT =======================
    PRODUCT_EXISTED("Product Existed", HttpStatus.BAD_REQUEST),
    PRODUCT_EXCEED_LIMIT(
        "Product Quantity is too high",
        HttpStatus.BAD_REQUEST
    ),
    PRODUCT_NOT_FOUND("Product Not Found", HttpStatus.NOT_FOUND),
    PRODUCT_NOT_EXIST("Product Not Exist", HttpStatus.BAD_REQUEST),
    PRODUCT_OUT_OF_STOCK("Product out of Stock!", HttpStatus.BAD_REQUEST),
    PRODUCT_CODE_DUPLICATED("Product Code Duplicated!", HttpStatus.BAD_REQUEST),
    PRODUCT_QUANTITY_CAN_NOT_BE_NEGATIVE(
        "Product Quantity Can Not Be Negative!",
        HttpStatus.BAD_REQUEST
    ),
    // ======================= SUPPLIER =======================
    SUPPLIER_NOT_EXISTED("Supplier Not Existed", HttpStatus.BAD_REQUEST),
    SUPPLIER_NOT_FOUND("Supplier Not Found", HttpStatus.NOT_FOUND),

    // ======================= COLOR =======================
    COLOR_NOT_EXISTED("Color Not Existed", HttpStatus.BAD_REQUEST),
    COLOR_NOT_FOUND("Color Not Found", HttpStatus.NOT_FOUND),
    COLOR_DOES_NOT_FIT_WITH_SUPPLIER(
        "Color Does Not Fit With Supplier",
        HttpStatus.CONFLICT
    ),
    ALBUM_NOT_FOUND("Album not found!", HttpStatus.NOT_FOUND),
    ALBUM_SUPPLIER_MISMATCH("Album and Supplier Mismatch !" , HttpStatus.CONFLICT),
    // ErrorCode
    COLOR_IMPORT_FILE_EMPTY("Import File Is Empty", HttpStatus.BAD_REQUEST),
    COLOR_IMPORT_INVALID_FORMAT("Import File Format Is Invalid", HttpStatus.BAD_REQUEST),
    COLOR_IMPORT_DUPLICATE_IN_FILE("Duplicate Color Code Or Hex Code In Import File", HttpStatus.BAD_REQUEST),

    // ======================= CATEGORY =======================
    CATEGORY_NOT_EXISTED("Category Not Existed", HttpStatus.BAD_REQUEST),
    CATEGORY_EXISTED("Category Existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND("Category Not Found", HttpStatus.NOT_FOUND),

    // ======================= CART =======================
    CART_ITEM_NOT_FOUND("Cart Item Not Found", HttpStatus.BAD_REQUEST),
    CART_NOT_EXISTED("Cart Item Not Existed", HttpStatus.BAD_REQUEST),
    CART_NOT_FOUND("Cart Not Found", HttpStatus.NOT_FOUND),
    CART_EMPTY("Cart Empty", HttpStatus.BAD_REQUEST),
    INVALID_CART_TOTAL("Invalid Cart Total", HttpStatus.BAD_REQUEST),

    // ======================= ORDER =======================
    ORDER_NOT_FOUND("Order Not Found", HttpStatus.NOT_FOUND),
    ORDER_NOT_BELONG_TO_USER(
        "Order Not Belong To User",
        HttpStatus.BAD_REQUEST
    ),
    UNSUPPORTED_ORDER_STATUS(
        "Unsupported Order Status",
        HttpStatus.BAD_REQUEST
    ),
    INSUFFICIENT_STOCK("Insufficient Stock", HttpStatus.BAD_REQUEST),
    ORDER_ITEM_NOT_FOUND(" Order Item Not Found", HttpStatus.NOT_FOUND),

    // ======================= WISHLIST =======================
    PRODUCT_EXISTED_IN_WISHLIST(
        "Product is existed in WishList",
        HttpStatus.BAD_REQUEST
    ),
    PRODUCT_NONE_EXISTED_IN_WISHLIST(
        "Product None Existed in WishList",
        HttpStatus.BAD_REQUEST
    ),

    // ======================= NOTIFICATION =======================
    NOTIFICATION_NOT_FOUND("Notification Not Found", HttpStatus.NOT_FOUND),
    USER_ID_REQUIRED("User Id Required", HttpStatus.BAD_REQUEST),
    NOTIFICATION_CONTENT_REQUIRED(
        "Notification Content Required",
        HttpStatus.BAD_REQUEST
    ),

    // ======================= INVENTORY =======================
    PURCHASE_ORDER_NOT_FOUND("Purchase Order Not Found", HttpStatus.NOT_FOUND),
    PURCHASE_STATUS_CHANGE(
        "Purchase Status Could Not Change Back ",
        HttpStatus.BAD_REQUEST
    ),

    // ======================= DIARY =======================
    DIARY_NOT_BELONG_TO_USER("Diary Not Belong To User", HttpStatus.NOT_FOUND),
    DIARY_ITEMS_NOT_FOUND("Diary Items Not Found", HttpStatus.NOT_FOUND),
    EXPORT_EXCEL_FILE_FAILED("Export Excel File Failed", HttpStatus.BAD_REQUEST),
    // ======================= PAYMENT =======================
    PAYMENT_NOT_FOUND("Payment Not Found", HttpStatus.NOT_FOUND),

    // ======================= PAYMENT =======================
    DIARY_NOT_FOUND("Diary Not Found", HttpStatus.NOT_FOUND),

    // ======================= IMPORT EXCEL FILE =======================
    EXCEL_FILE_EMPTY("Excel File Is Empty Or Invalid", HttpStatus.BAD_REQUEST),
    EXCEL_READ_FAILED("Failed To Read Excel File", HttpStatus.BAD_REQUEST),

    // ======================= CLOUDINARY =======================
    IMG_OVER_SIZE("Your Image is over size!", HttpStatus.BAD_REQUEST),

    // ======================= UNKNOWN =======================
    UNKNOWN_ERROR("Unknown Error", HttpStatus.INTERNAL_SERVER_ERROR),
    WRONG_PATH("Wrong Path", HttpStatus.BAD_REQUEST),
    INVALID_EXTRA_SPECSi("Invalid Extra Specs", HttpStatus.BAD_REQUEST);

    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(String message, HttpStatusCode statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
