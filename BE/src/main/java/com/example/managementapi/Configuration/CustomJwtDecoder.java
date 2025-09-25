package com.example.managementapi.Configuration;

import com.example.managementapi.Dto.Request.Auth.IntrospectRequest;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Enum.Status;
import com.example.managementapi.Repository.UserRepository;
import com.example.managementapi.Service.AuthenticateService;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Objects;

@RequiredArgsConstructor
@Component
public class CustomJwtDecoder implements JwtDecoder {

    @NonFinal
    @Value("${signer.key}")
    protected String SIGNER_KEY;

    private final UserRepository userRepository;

    private final AuthenticateService authenticateService;

    private NimbusJwtDecoder nimbusJwtDecoder  = null;

    @Override
    public Jwt decode(String token) throws JwtException {
        try {

            //? Kiểm tra token
            var response = authenticateService.introspect(IntrospectRequest.builder()
                    .token(token)
                    .build());

            if (!response.isValid())
                throw new JwtException("Token invalid");


        } catch (JOSEException | ParseException e) {
            throw new JwtException(e.getMessage());
        }

        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder
                    .withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }

        return nimbusJwtDecoder.decode(token);
    }
}
