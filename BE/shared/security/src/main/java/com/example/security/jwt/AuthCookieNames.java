package com.example.security.jwt;

/**
 * Ten cookie httpOnly dung de luu access/refresh token cho web client (USER app).
 * ADMIN/Mobile van tiep tuc dung token tra ve trong response body nhu truoc,
 * khong bi anh huong boi 2 cookie nay.
 */
public final class AuthCookieNames {

    public static final String ACCESS_TOKEN = "access_token";
    public static final String REFRESH_TOKEN = "refresh_token";

    private AuthCookieNames() {
    }
}
