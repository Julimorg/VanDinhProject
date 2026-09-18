package com.example.common.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
@RequiredArgsConstructor
public class GenerateOtp {

    private static final long OTP_EXPIRY_MS = 5 * 60 * 1000L;
    private static final int OTP_MIN = 100_000;
    private static final int OTP_MAX = 999_999;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    public int generateOtp() {
        return SECURE_RANDOM.nextInt(OTP_MAX - OTP_MIN + 1) + OTP_MIN;
    }

}
