package com.example.managementapi.Service;

import com.example.managementapi.Dto.Request.Auth.*;
import com.example.managementapi.Dto.Response.Auth.LoginRes;
import com.example.managementapi.Dto.Response.Auth.IntrospectResponse;
import com.example.managementapi.Dto.Response.Auth.RefreshRes;
import com.example.managementapi.Dto.Response.User.SignUpUserRes;
import com.example.managementapi.Entity.InvalidatedToken;
import com.example.managementapi.Entity.Role;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Enum.ErrorCode;
import com.example.managementapi.Enum.Status;
import com.example.managementapi.Enum.TokenType;
import com.example.managementapi.Enum.UserRole;
import com.example.managementapi.Exception.AppException;
import com.example.managementapi.Mapper.UserMapper;
import com.example.managementapi.Repository.InvalidatedTokenRepository;
import com.example.managementapi.Repository.RoleRepository;
import com.example.managementapi.Repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticateService {

    private final UserRepository userRepository;

    private final InvalidatedTokenRepository invalidatedTokenRepository;

    private final UserMapper userMapper;

    private final RoleRepository roleRepository;

    @NonFinal
    @Value("${signer.key}")
    protected  String SIGNER_KEY;

    @NonFinal
    @Value("${expiry.date}")
    protected long EXPIRY_DATE;

    @NonFinal
    @Value("${refreshable.duration}")
    protected long REFRESH_DURATION;

    //* =================================== Auth Service =================================== //

    public LoginRes login(LoginReq request) {

        var user = userRepository.findByUserName(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var status =  user.getStatus();

        if (Objects.equals(String.valueOf(status), "INACTIVE")){
            throw new AppException(ErrorCode.BANNED);
        }

        PasswordEncoder passwordEncode = new BCryptPasswordEncoder(10);

        boolean authenticate = passwordEncode.matches(request.getPassword(), user.getPassword());

        if(!authenticate)
            throw  new AppException(ErrorCode.UNAUTHENTICATED);

        var accessToken = generateToken(user, EXPIRY_DATE, String.valueOf(TokenType.ACCESS_TOKEN));

        var refreshToken = generateToken(user, REFRESH_DURATION, String.valueOf(TokenType.REFRESH_TOKEN));

        return LoginRes.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }

    public SignUpUserRes signUp(SignUpReq request){

        if(userRepository.existsByUserName(request.getUserName()))
            throw  new AppException((ErrorCode.USER_EXISTED));

        //? Sử dụng Mapper
        User user = userMapper.toUser(request);

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setStatus(Status.ACTIVE);

        Role userRole = roleRepository.findByName(String.valueOf(UserRole.USER))
                .orElseThrow(() -> new RuntimeException("Role USER not found"));

        user.setRoles(Set.of(userRole));

        return userMapper.toSignUpUserRes(userRepository.save(user));
    }
    public void logOut(LogOutReq request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);
            String jit = signToken.getJWTClaimsSet().getJWTID();

            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jit)
                    .expiryDate(expiryTime)
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        }catch (AppException e){
            log.error("Token already expired");
        }
    }
    public RefreshRes refreshToken(RefreshReq request )
            throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getRefreshToken(), true);

        var jit = signedJWT.getJWTClaimsSet().getJWTID();

        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();


        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryDate(expiryTime)
                .build();

        invalidatedTokenRepository.save(invalidatedToken);

        var username = signedJWT.getJWTClaimsSet().getSubject();

        var user = userRepository.findByUserName(username).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_EXISTED));

        var token = generateToken(user, EXPIRY_DATE, String.valueOf(TokenType.ACCESS_TOKEN));

        return RefreshRes.builder()
                .accessToken(token)
                .authenticated(true)
                .build();
    }
    //? Check verify Token
    public IntrospectResponse introspect(IntrospectRequest request) throws ParseException, JOSEException {
        var token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token, false);
            isValid = false;
        }
        catch(AppException e){
            return IntrospectResponse.builder()
                    .valid(isValid)
                    .build();
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    //* =================================== JWT Service =================================== //

    //? Tạo Token
    //?  JWT tuân thủ theo 3 param của chính nó
    //?         -- HEADER -- PAYLOAD -- SIGNATURE --
    private String generateToken(User user, long expiryInSeconds, String tokenType){

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimSet = new JWTClaimsSet.Builder()
                .subject(user.getUserName()) // --> dai dien cho user dang nhap
                .issuer("kienphongtran2003@gmail.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(expiryInSeconds, ChronoUnit.SECONDS ).toEpochMilli()
                )) // --> Hạn của Token
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .claim("token_type", tokenType)
                .build();


        //? Tạo Payload cho Token và truyền jwtClaimSet dưới dạng JSONObject vào
        Payload payload = new Payload(jwtClaimSet.toJSONObject());

        //? jwsObject cần phai thỏa mãn điều kiện 1 trong 3 yếu tố
        //? HEADER - PAYLOAD - SIGNATURE
        JWSObject jwsObject = new JWSObject(header, payload);

        //? Sign Token voi thuat toan MACSigner
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }

    }


    //? Config Role - Permission bên trong Payload của JWT
    private String buildScope(User user){
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRoles())) {
            log.warn("get role here!");
            user.getRoles().forEach(role -> {
                log.error("SCOPE ROLE: " + user.getRoles());
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions()
                            .forEach(permission -> stringJoiner.add(permission.getName()));
                }
            });
        } else{
            log.info("cant not get role!");
        }

        return stringJoiner.toString();
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws ParseException, JOSEException {

        JWSVerifier verifier = new MACVerifier(SIGNER_KEY);

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet()
                .getExpirationTime()
                .toInstant()
                .plus(REFRESH_DURATION, ChronoUnit.SECONDS)
                .toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if(!verified && expiryTime.after(new Date()))
            throw  new AppException(ErrorCode.UNAUTHENTICATED);

        if(invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }
}
