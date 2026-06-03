package com.example.security.Util;

import com.example.common.interfaces.user.UserInternalService;
import com.example.persistence.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UtilSecurityClass {

    private final UserInternalService userInternalService;

    public String getCurrentUsername() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String userId = "";

        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            userId = jwt.getAudience().getFirst();
        }

        log.error("============== USER ID AFTER EXTRACT: {}" , userId);

            User user = userInternalService.getUserById(userId);

        return user.getUserName();

    }

}
