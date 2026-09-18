package com.example.security.Util;

import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.interfaces.user.UserInternalService;
import com.example.persistence.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class UtilSecurityClass {

    private final UserInternalService userInternalService;

    /**
     * Lay userId cua nguoi dang goi request tu claim "aud" trong JWT.
     * Dung method nay (khong lay userId tu path/body) o moi noi can kiem tra
     * quyen so huu resource, de tranh loi IDOR.
     */
    public String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            List<String> audience = jwt.getAudience();

            if (audience != null && !audience.isEmpty()) {
                return audience.get(0);
            }
        }

        throw new AppException(ErrorCode.UNAUTHENTICATED);
    }

    /**
     * Kiem tra userId cua resource dang truy cap co trung voi nguoi dang dang nhap khong.
     * Throw AppException(UNAUTHORIZED) neu khac nhau (chan IDOR).
     */
    public void requireOwner(String resourceOwnerId) {
        if (resourceOwnerId == null || !resourceOwnerId.equals(getCurrentUserId())) {
            throw new AppException(ErrorCode.RESOURCE_ACCESS_DENIED);
        }
    }

    public String getCurrentUsername() {
        String userId = getCurrentUserId();
        User user = userInternalService.getUserById(userId);
        return user.getUserName();
    }

}
