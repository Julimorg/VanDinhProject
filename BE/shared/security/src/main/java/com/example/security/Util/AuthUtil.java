//package com.example.security.Util;
//
//import com.example.security.config.CustomUserDetails;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//
//@Component
//public class AuthUtil {
//
//    public CustomUserDetails getCurrentUser() {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        return (CustomUserDetails) auth.getPrincipal();
//    }
//
//    public String getCurrentUserId() {
//        return getCurrentUser().getUserId();
//    }
//
//    public String getCurrentUsername() {
//        return getCurrentUser().getUsername();
//    }
//
//}
