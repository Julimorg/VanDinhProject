package com.example.common.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@RequiredArgsConstructor
public class GenerateOtp {

    private static final long OTP_EXPIRY_MS = 5 * 60 * 1000L;
    private static final int OTP_MIN = 100_000;
    private static final int OTP_MAX = 999_999;

    public int generateOtp() {
        return new Random().nextInt(OTP_MAX - OTP_MIN + 1) + OTP_MIN;
    }

}
