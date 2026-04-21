package com.example.auth.service;

import com.example.auth.repository.AuthRepository;
import com.example.auth.repository.ForgotPasswordRepository;
import com.example.common.enums.ErrorCode;
import com.example.common.exception.AppException;
import com.example.common.util.GenerateOtp;
import com.example.messaging.service.MailService;
import com.example.persistence.entity.ForgotPassword;
import com.example.persistence.entity.User;
import com.example.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class ForgotPassService {

    /*TODO - Refactor changePassword()
    * -- su dung updatePassword trong AuthRepo thay vi dung save() don thuan
    * */

    private static final long OTP_EXPIRY_MS = 5 * 60 * 1000L;
    private static final int OTP_MIN = 100_000;
    private static final int OTP_MAX = 999_999;

    private final UserRepository userRepository;

    private final AuthRepository authRepository;

    private final ForgotPasswordRepository forgotPasswordRepository;

    private final PasswordEncoder passwordEncoder;

    private final MailService mailService;

    private final GenerateOtp generateOtp;

    @Transactional
    public void sendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_FOUND));

        int otp = generateOtp.generateOtp();

        Date expiryTime = Date.from(Instant.now().plusMillis(OTP_EXPIRY_MS));

        ForgotPassword forgotPassword = forgotPasswordRepository.findByUser(user)
                .map(existing -> {
                    existing.setOtp(otp);
                    existing.setExpirationTime(expiryTime);
                    return existing;
                })
                .orElseGet(() -> ForgotPassword.builder()
                        .otp(otp)
                        .expirationTime(expiryTime)
                        .user(user)
                        .build());

        forgotPasswordRepository.save(forgotPassword);

        try {
            mailService.sendOtpEmail(user.getEmail(), otp);
        } catch (Exception e) {
            log.error("Gửi OTP thất bại cho email {}: {}", email, e.getMessage());
            throw new AppException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    public void verifyOtp(String email, int otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_FOUND));

        ForgotPassword forgotPassword = forgotPasswordRepository.findByOtpAndUser(otp, user)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_OTP));

        if (forgotPassword.getExpirationTime().before(Date.from(Instant.now()))) {
            forgotPasswordRepository.delete(forgotPassword);
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }
    }

    @Transactional
    public void changePassword(String email, String newPassword, String confirmPassword) {
        if (!newPassword.equals(confirmPassword)) {
            throw new AppException(ErrorCode.PASSWORD_MISMATCH);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
