package com.example.auth.repository;

import com.example.persistence.entity.ForgotPassword;
import com.example.persistence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPassword, String> {
    Optional<ForgotPassword> findByUser(User user);

    Optional<ForgotPassword> findByOtpAndUser(int otp, User user);
}
