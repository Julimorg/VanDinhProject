package com.example.managementapi.Service;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;


@Service
public class JwtService {

//    @NonFinal
//    @Value("${signer.key}")
//    private String secretKey;

    //? Lấy userId từ Token
    public String extractUserId(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();


            String aud = claims.getAudience().getFirst();
            return aud;

        } catch (ParseException e) {
            throw new RuntimeException("Invalidated Token", e);
        }
    }

    /*
     * Optional! Lấy username nếu cần
     */
    public String extractUsername(String token) {
        try {
            return SignedJWT.parse(token).getJWTClaimsSet().getSubject();
        } catch (Exception e) {
            return null;
        }
    }
}
