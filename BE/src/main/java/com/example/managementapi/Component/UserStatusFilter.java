package com.example.managementapi.Component;

import com.example.managementapi.Dto.ApiResponse;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Enum.ErrorCode;
import com.example.managementapi.Enum.Status;
import com.example.managementapi.Exception.UserBannedException;
import com.example.managementapi.Repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class UserStatusFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        logger.info("UserStatusFilter is processing request for URI: {}" + request.getRequestURI());


        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if( authentication != null && authentication.isAuthenticated()){

            String username = authentication.getName();
            logger.info("Checking status for user: {}" + username);
            User user = userRepository.findByUserName(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (user.getStatus() == Status.INACTIVE) {
                logger.warn("User {} is banned (INACTIVE)" + username);

                throw new RuntimeException("User is banned (INACTIVE)");

            } else{
                logger.info("User {} is ACTIVE  " + username);
            }
        }else {
            logger.info("No authenticated user found for request: {}" + request.getRequestURI());
        }
        filterChain.doFilter(request, response);
    };
}