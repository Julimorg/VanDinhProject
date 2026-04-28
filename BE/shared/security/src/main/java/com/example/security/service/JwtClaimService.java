package com.example.security.service;

import com.example.common.security.TokenValidator;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
public class JwtClaimService implements TokenValidator {

    @Override
    public boolean isValid(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            // Check expiration
            Date expiration = claims.getExpirationTime();
            if (expiration == null || expiration.before(new Date())) {
                log.warn("Token expired at {}", expiration);
                return false;
            }

            return true;

        } catch (ParseException e) {
            log.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /* *
     * Claim UserId from Token
     * Extract userId từ audience claim.
     * Trả null thay vì throw — caller tự quyết định xử lý.
     */
    @Override
    public String extractUserId(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            List<String> audience = signedJWT.getJWTClaimsSet().getAudience();

            if (audience == null || audience.isEmpty()) return null;

            return audience.getFirst();

        } catch (ParseException e) {
            log.warn("Failed to parse token: {}", e.getMessage());
            return null;
        }
    }

    public String extractUsername(String token) {
        try {
            return SignedJWT.parse(token).getJWTClaimsSet().getSubject();
        } catch (Exception e) {
            return null;
        }
    }

}
