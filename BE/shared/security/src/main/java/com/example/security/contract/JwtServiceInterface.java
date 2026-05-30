package com.example.security.contract;

import com.example.persistence.entity.User;
import com.example.persistence.enumTable.TokenType;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;

import java.text.ParseException;
import java.util.Date;

public interface JwtServiceInterface {

    String extractUserId(SignedJWT signedJWT);

    String extractJwtId(SignedJWT signedJWT);

    String extractUserName(String token);

    Date extractExpiration(SignedJWT signedJWT);

    String buildScope(User user);

    String buildToken(User user,
                      long expiryDate,
                      TokenType tokenType);

    SignedJWT verifyAndParse(String token) throws JOSEException, ParseException;


    boolean isValid(String token);
}
