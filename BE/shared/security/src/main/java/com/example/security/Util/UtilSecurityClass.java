package com.example.security.Util;

import com.example.common.interfaces.user.UserInternalService;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

@Slf4j
@UtilityClass
public class UtilSecurityClass {

    private UserInternalService userInternalService;

    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String userId = "";

        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            userId = jwt.getAudience().getFirst();
        }

        return userInternalService
                .getUserNameById(userId)
                .getUserName();
    }

}
