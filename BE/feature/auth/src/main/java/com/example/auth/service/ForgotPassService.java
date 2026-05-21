package com.example.auth.service;
import com.example.auth.repository.AuthRepository;
import com.example.auth.repository.ForgotPasswordRepository;
import com.example.common.dto.auth.request.ChangePasswordReq;
import com.example.common.dto.auth.request.VerifyOtp;
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
import java.time.LocalDateTime;
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

        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

        //? Đoạn này rất quan trọng
        //? Mình phải check xem trong User đã có ForgotPass chưa?
        //?     Tại sao phải check?
        //?         --> Vì ta có relational OneToOne giũa User và ForgotPassword ( OTP, ExpiryDate )
        //?              không thể có 1 user mà nhiều mã OTP được, dẫn đều việc nếu user resend otp
        //?              sẽ bị conflict giữa DB
        //?  Nên là khi check User đã có ForgetPass rồi thì chỉ cần việc generate ra OTP, ExpiryDate mới
        //?   và update lại OTP, ExpiryDate và  trong forget password là xong
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

    public void verifyOtp(String email, VerifyOtp otpReq) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.EMAIL_NOT_FOUND));

        ForgotPassword forgotPassword = forgotPasswordRepository
                .findByOtpAndUser(otpReq.getOtp(), user)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_OTP));

        //? check ExpiryDate của OTP
        //? Nếu ExpiryDate là 12:20 mà CurrentTime của User là 12:25
        //? if ( 12:20-(ExpiryDate) before 12:25-(CurrentTime) ) --> True --> OTP dã hết hạn
        if (forgotPassword.getExpirationTime().isBefore(LocalDateTime.now())) {
            //? Cần phải delete đi OTP cũ
            //? Vì FP OneToOne với User, nên 1 user ko nên có quá nhiều mã OTP trong DB
            //? Nên cứ Expiry thì del nó đi cho đồng bộ relational
            forgotPasswordRepository.delete(forgotPassword);
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }
    }

    @Transactional
    public void changePassword(ChangePasswordReq changePassword,
                               String email) {
        if (!changePassword.getPassword().equals(changePassword.getNewPassword())) {
            throw new AppException(ErrorCode.PASSWORD_MISMATCH);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        String encodedPassword = passwordEncoder.encode(changePassword.getNewPassword());

        authRepository.updatePassword(email,  encodedPassword);
    }
}
