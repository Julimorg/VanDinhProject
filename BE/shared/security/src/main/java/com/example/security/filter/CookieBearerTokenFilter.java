package com.example.security.filter;

import com.example.security.jwt.AuthCookieNames;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;

/**
 * Cau noi cho web client (USER app) dang luu access/refresh token trong cookie
 * httpOnly: neu request KHONG co header Authorization (vi JS khong doc duoc
 * cookie httpOnly de tu gan header), filter nay doc token tu cookie va gia
 * lap header "Authorization: Bearer <token>" truoc khi di vao
 * BearerTokenAuthenticationFilter cua Spring Security.
 *
 * ADMIN/Mobile van gui header Authorization nhu truoc -> filter nay bo qua
 * hoan toan (request.getHeader("Authorization") da co gia tri), khong anh
 * huong gi ca.
 */
@Component
public class CookieBearerTokenFilter extends OncePerRequestFilter {

    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String REFRESH_TOKEN_PATH = "/api/v1/auth/refresh-token";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {

        if (request.getHeader(AUTH_HEADER) != null) {
            filterChain.doFilter(request, response);
            return;
        }

        String cookieName = request.getRequestURI().contains(REFRESH_TOKEN_PATH)
                ? AuthCookieNames.REFRESH_TOKEN
                : AuthCookieNames.ACCESS_TOKEN;

        String token = extractCookie(request, cookieName);

        if (token == null || token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        filterChain.doFilter(new BearerHeaderRequestWrapper(request, BEARER_PREFIX + token), response);
    }

    private String extractCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    /**
     * Wrapper chi gia lap duy nhat header Authorization - moi header khac giu nguyen.
     */
    private static final class BearerHeaderRequestWrapper extends HttpServletRequestWrapper {

        private final String authorizationValue;

        private BearerHeaderRequestWrapper(HttpServletRequest request, String authorizationValue) {
            super(request);
            this.authorizationValue = authorizationValue;
        }

        @Override
        public String getHeader(String name) {
            if (AUTH_HEADER.equalsIgnoreCase(name)) {
                return authorizationValue;
            }
            return super.getHeader(name);
        }

        @Override
        public Enumeration<String> getHeaders(String name) {
            if (AUTH_HEADER.equalsIgnoreCase(name)) {
                return Collections.enumeration(Collections.singletonList(authorizationValue));
            }
            return super.getHeaders(name);
        }

        @Override
        public Enumeration<String> getHeaderNames() {
            Enumeration<String> original = super.getHeaderNames();
            if (super.getHeader(AUTH_HEADER) != null) {
                return original;
            }
            java.util.List<String> names = Collections.list(original);
            names.add(AUTH_HEADER);
            return Collections.enumeration(names);
        }
    }
}
