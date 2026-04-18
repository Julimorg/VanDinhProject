package com.example.auth.service;

import com.example.common.enums.TokenType;
import com.example.persistence.entity.User;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {
    @Value("${signer.key}")
    protected  String SIGNER_KEY;

    @Value("${expiry.date}")
    protected long ACCESS_TOKEN_EXPIRY_TIME;

    @Value("${refreshable.duration}")
    protected long REFRESHABLE_DURATION;


    public String generateAccessToken(User user) {
        return buildToken(user, ACCESS_TOKEN_EXPIRY_TIME, TokenType.ACCESS_TOKEN);
    }

    public String generateRefreshToken(User user) {
        return buildToken(user, REFRESHABLE_DURATION, TokenType.REFRESH_TOKEN);
    }

    public String extractUserId(String token) {
        try {
            return SignedJWT.parse(token).getJWTClaimsSet().getAudience().getFirst();
        } catch (ParseException e) {
            throw new RuntimeException("Cannot parse token", e);
        }
    }

    public String extractUsername(String token) {
        try {
            return SignedJWT.parse(token).getJWTClaimsSet().getSubject();
        } catch (ParseException e) {
            throw new RuntimeException("Cannot parse token", e);
        }
    }

    public String extractJwtId(SignedJWT signedJWT) {
        try {
            return signedJWT.getJWTClaimsSet().getJWTID();
        } catch (ParseException e) {
            throw new RuntimeException("Cannot parse token", e);
        }
    }

    public Date extractExpiry(SignedJWT signedJWT) {
        try {
            return signedJWT.getJWTClaimsSet().getExpirationTime();
        } catch (ParseException e) {
            throw new RuntimeException("Cannot parse token", e);
        }
    }


    private String buildScope(User user) {
        StringJoiner joiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                joiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions().forEach(p -> joiner.add(p.getName()));
                }
            });
        }

        return joiner.toString();
    }

    private String buildToken(User user, long expiryDate, TokenType tokenType){

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .audience(user.getId())
                .issuer("vandinhstore@example.com")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(expiryDate, ChronoUnit.SECONDS)))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .claim("token_type", tokenType.name())
                .build();

        JWSObject jwsObject = new JWSObject(header, new Payload(claims.toJSONObject()));

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Không thể tạo token: {}", e.getMessage());
            throw new RuntimeException("Token generation failed", e);
        }
    }

    public SignedJWT verifyAndParse(String token) throws ParseException, JOSEException {
        SignedJWT signedJWT = SignedJWT.parse(token);

        // Verify JWT Signature
        if (!signedJWT.verify(new MACVerifier(SIGNER_KEY))) {
            throw new JOSEException("Invalid token signature");
        }

        // Verify expire
        Date expiry = signedJWT.getJWTClaimsSet().getExpirationTime();
        if (new Date().after(expiry)) {
            throw new JOSEException("Token expired");
        }

        return signedJWT;
    }
}
