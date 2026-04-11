package com.example.security.config;

/**
 * Interface này được định nghĩa ở :shared:security nhưng IMPLEMENT ở :feature:auth.
 *
 * Mục đích: tránh circular dependency giữa CustomJwtDecoder (shared:security)
 * và AuthenticateService (feature:auth).
 *
 * Flow:
 *   CustomJwtDecoder → TokenIntrospector (interface) ← AuthenticateServiceImpl (feature:auth)
 */

public interface TokenIntrospector {

    /**
     * Kiểm tra token còn hợp lệ không (chưa bị revoke, chưa hết hạn).
     *
     * @param token JWT token string
     * @return true nếu token valid, false nếu đã bị revoke hoặc invalid
     */

    boolean isValid(String token);

}
