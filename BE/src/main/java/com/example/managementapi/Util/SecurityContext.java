package com.example.managementapi.Util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class SecurityContext {
    public static String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            // Nếu bạn dùng JWT custom, thường là String (userId)
            if (authentication.getPrincipal() instanceof String) {
                return (String) authentication.getPrincipal();
            }
            // Nếu dùng UserDetails (tự implement)
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                return userDetails.getUsername(); // hoặc userDetails.getUserId() nếu bạn thêm field
            }
        }
        return null;
    }

    public static String getCurrentUserIdOrThrow() {
        String userId = getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("Không tìm thấy người dùng trong Security Context");
        }
        return userId;
    }
}
