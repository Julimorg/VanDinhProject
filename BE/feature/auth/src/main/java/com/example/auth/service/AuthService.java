package com.example.auth.service;

import com.example.auth.domain.dto.request.IntrospectRequest;
import com.example.auth.domain.dto.request.LogOutReq;
import com.example.auth.domain.dto.request.LoginReq;
import com.example.auth.domain.dto.request.SignUpReq;
import com.example.auth.domain.dto.response.IntrospectResponse;
import com.example.auth.domain.dto.response.LoginRes;
import com.example.auth.domain.dto.response.RefreshRes;
import com.example.auth.domain.dto.response.SignUpUserRes;
import com.example.auth.domain.mapper.AuthMapper;
import com.example.auth.repository.AuthRepository;
import com.example.auth.repository.InvalidatedTokenRepository;
import com.example.common.enums.ErrorCode;
import com.example.common.enums.Status;
import com.example.common.exception.AppException;
import com.example.persistence.entity.InvalidatedToken;
import com.example.persistence.entity.Role;
import com.example.persistence.entity.User;
import com.example.user.repository.RoleRepository;
import com.example.user.repository.UserRepository;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final InvalidatedTokenRepository invalidatedTokenRepository;

    private final AuthRepository authRepository;

    private final AuthMapper authMapper;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    private boolean isBlacklisted(SignedJWT signedJWT) {
        return invalidatedTokenRepository.existsById(jwtService.extractJwtId(signedJWT));
    }


    private void blacklistToken(SignedJWT signedJWT) {
        InvalidatedToken invalidated = InvalidatedToken.builder()
                .id(jwtService.extractJwtId(signedJWT))
                .expiryDate(jwtService.extractExpiry(signedJWT))
                .build();
        invalidatedTokenRepository.save(invalidated);
    }

    /**
     *   - verifyAndParse thành công → token valid → trả về true
     *   - verifyAndParse throw exception → token invalid → trả về false
     */
    public IntrospectResponse introspect(IntrospectRequest request) {
        try {
            SignedJWT signedJWT = jwtService.verifyAndParse(request.getToken());
            boolean notBlacklisted = !isBlacklisted(signedJWT);
            return IntrospectResponse.builder().valid(notBlacklisted).build();
        } catch (Exception e) {
            return IntrospectResponse.builder().valid(false).build();
        }
    }

    public LoginRes login(LoginReq req) {

        User user = userRepository.findByUserName(req.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_EXISTED));

        if ( user.getStatus() == Status.ACTIVE) {
            throw new AppException(ErrorCode.BANNED);
        }

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return authMapper.toLoginRes(user);
    }

    public SignUpUserRes  signUp(SignUpReq req) {
        if (userRepository.existsByUserName(req.getUserName())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new AppException(ErrorCode.EMAIl_EXISTED);
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

        User user = User.builder()
                .userName(req.getUserName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .status(Status.ACTIVE)
                .roles(Set.of(userRole))
                .build();

        return authMapper.toSignUpUserRes(userRepository.save(user));
    }

    public void logOut(LogOutReq request) {
        try {
            SignedJWT signedJWT = jwtService.verifyAndParse(request.getToken());
            blacklistToken(signedJWT);
        } catch (Exception e) {
            log.info("Logout: token đã hết hạn hoặc không hợp lệ, bỏ qua.");
        }
    }

    public RefreshRes refreshToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        try {
            SignedJWT signedJWT = jwtService.verifyAndParse(authHeader.substring(7));

            if (isBlacklisted(signedJWT)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            String username = signedJWT.getJWTClaimsSet().getSubject();
            User user = userRepository.findByUserName(username)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            return authMapper.toRefreshRes(user);

        } catch (ParseException | JOSEException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }



}
