package com.example.auth.service;

import com.example.auth.repository.InvalidatedTokenRepository;
import com.example.security.contract.TokenIntrospector;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.text.ParseException;

/**
 * Implementation của TokenIntrospector (interface định nghĩa ở :shared:security)
 * để CustomJwtDecoder có thể kiểm tra token đã bị revoke (logout/blacklist) hay chưa,
 * mà không cần :shared:security phụ thuộc trực tiếp vào :feature:auth.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TokenIntrospectorImpl implements TokenIntrospector {

    private final InvalidatedTokenRepository invalidatedTokenRepository;

    @Override
    public boolean isValid(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            String jwtId = signedJWT.getJWTClaimsSet().getJWTID();

            if (jwtId == null) {
                return false;
            }

            return !invalidatedTokenRepository.existsById(jwtId);
        } catch (ParseException e) {
            log.warn("Cannot parse token during introspection: {}", e.getMessage());
            return false;
        }
    }
}
