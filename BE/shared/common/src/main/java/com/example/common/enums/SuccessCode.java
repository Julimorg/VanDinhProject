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
    SEND_OTP("Send OTP Successfully!", HttpStatus.OK),
    OTP_VERIFIED("OTP Verified!", HttpStatus.OK),

    // ======================= USER =======================
    GET_USER_SELECTION("Successfully!", HttpStatus.OK),
    GET_USER("Get User Successfully!", HttpStatus.OK),
    GET_USER_PROFILE_DETAIL(
        "Get User Profile Detail Successfully!",
        HttpStatus.OK
    ),
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
    GET_CATEGORY_SELECTION(
        "Get Category Selection Successfully! ",
        HttpStatus.OK
    ),
    GET_CATEGORY_DETAIL("Get Category Detail Successfully! ", HttpStatus.OK),
    GET_CATEGORY("Get Category Successfully! ", HttpStatus.OK),
    DELETE_CATEGORY("Delete Category Successfully! ", HttpStatus.OK),

    // ======================= PRODUCT =======================
    GET_PRODUCT_SELECTION("Successfully!", HttpStatus.OK),
    GET_PRODUCT_NEW_ARRIVAL(
        "Get Product New Arrival Successfully!",
        HttpStatus.OK
    ),
    GET_PRODUCT("Get Product Successfully!", HttpStatus.OK),
    CREATE_PRODUCT("Create Product Successfully!", HttpStatus.OK),
    UPDATE_PRODUCT("Update Product Successfully!", HttpStatus.OK),
    GET_PRODUCT_DETAIL("Get Product Detail Successfully!", HttpStatus.OK),
    UPDATE_PRODUCT_QUANTITY(
        "Update Product Quantity Successfully!",
        HttpStatus.OK
    ),
    DELETE_PRODUCT("Delete Product Successfully!", HttpStatus.OK),

    // ======================= PRODUCT =======================
    GET_CART("Successfully!", HttpStatus.OK),
    ADD_PRODUCT_TO_CART("Add Product to Cart Successfully!", HttpStatus.OK),
    UPDATE_CART("Update Cart Successfully!", HttpStatus.OK),
    DELETE_CART(" Delete Cart Successfully!", HttpStatus.OK),

    // ======================= NOTIFICATION =======================
    GET_USER_ONLINE("Successfully!", HttpStatus.OK),
    SEND_TO_USER_SUCCESSFULLY("Send To User Successfully!", HttpStatus.OK),
    GET_TOP_FIVE_NOTIFICATIONS(" Successfully!", HttpStatus.OK),
    GET_ALL_NOTIFICATIONS("Get All Notifications Successfully!", HttpStatus.OK),
    GET_UNREAD_NOTIFICATIONS(
        "Get Unread Notifications Successfully!",
        HttpStatus.OK
    ),
    MARK_AS_READ("Mark as Read Successfully!", HttpStatus.OK),
    SEND_TO_ADMIN("Send To Admin Successfully!", HttpStatus.OK),

    // ======================= ORDER =======================
    APPROVE_ORDER("Approve Order Successfully!", HttpStatus.OK),
    CANCELED_ORDER("Cancel Order Successfully!", HttpStatus.OK),
    GET_USER_ORDER("Get User Order Successfully! ", HttpStatus.OK),
    GET_ALL_ORDER("Get All Order Successfully! ", HttpStatus.OK),
    GET_ORDER_DETAIL("Get Order Detail Successfully! ", HttpStatus.OK),
    CREATE_ORDER("Create Order Successfully! ", HttpStatus.OK),
    UPDATE_ORDER("Update Order Successfully! ", HttpStatus.OK),
    UPDATE_ORDER_BY_ADMIN(
        "Update Order By Admin Successfully! ",
        HttpStatus.OK
    ),
    UPDATE_ORDER_ITEM("Update Order Item Successfully! ", HttpStatus.OK),

    // ======================= INVENTORY =======================
    GET_INVENTORY("Get Inventory Successfully! ", HttpStatus.OK),
    CREATE_INVENTORY("Create Inventory Successfully! ", HttpStatus.OK),
    DELETE_PURCHASE_ORDER(
        "Delete Purchase Order Successfully! ",
        HttpStatus.OK
    ),
    EXPORT_PDF_FILE("Export PDF File Successfully!", HttpStatus.OK),
    UPDATE_INVENTORY("Update Inventory Successfully! ", HttpStatus.OK),

    // ======================= DIARY =======================
    CREATE_DIARY("Create Diary Successfully!", HttpStatus.CREATED),
    CREATE_DIARY_ITEMS("Create Diary Items Successfully!", HttpStatus.CREATED),
    GET_DIARIES("Get Diaries Successfully!", HttpStatus.OK),
    GET_DIARY("Get Diary Successfully!", HttpStatus.OK),
    UPDATE_DIARY("Update Diary Successfully!", HttpStatus.OK),
    UPDATE_STATUS("Update Status Successfully!", HttpStatus.OK),
    UPDATE_ITEM_DIARY("Update Item Diary Successfully!", HttpStatus.OK),
    DELETE_DIARY("Delete Diary Successfully!", HttpStatus.OK),
    DELETE_ITEM_DIARY("Delete Item Diary Successfully!", HttpStatus.OK);
    private final String message;
    private final HttpStatusCode statusCode;

    SuccessCode(String message, HttpStatusCode statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
