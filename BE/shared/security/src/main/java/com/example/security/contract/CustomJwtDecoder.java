package com.example.security.contract;


import com.example.security.config.TokenIntrospector;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.util.Objects;


/**
 * Custom JwtDecoder:
 *  1. Gọi TokenIntrospector.isValid() để check token chưa bị revoke
 *  2. Dùng NimbusJwtDecoder để verify signature + expiry
 *
 * TokenIntrospector là interface — được implement ở :feature:auth.
 * Inject qua Spring DI, KHÔNG import trực tiếp class từ feature module.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CustomJwtDecoder implements JwtDecoder {

    @Value("${signer.key}")
    private String signerKey;

    // Inject interface — implementation nằm ở feature:auth
    private final TokenIntrospector tokenIntrospector;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override
    public Jwt decode(String token) throws JwtException {
        // Bước 1: kiểm tra token có bị revoke không
        if (!tokenIntrospector.isValid(token)) {
            log.warn("Token failed introspection (revoked or invalid)");
            throw new JwtException("Token invalid or has been revoked");
        }

        // Bước 2: verify signature bằng Nimbus
        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder
                    .withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }

        return nimbusJwtDecoder.decode(token);
    }

}
