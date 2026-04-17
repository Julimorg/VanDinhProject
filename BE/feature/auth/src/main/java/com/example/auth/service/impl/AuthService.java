package com.example.auth.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    @NonFinal
    @Value("${signer.key}")
    protected  String SIGNER_KEY;

    @NonFinal
    @Value("${expiry.date}")
    protected long EXPIRY_DATE;

    @NonFinal
    @Value("${refreshable.duration}")
    protected long REFRESH_DURATION;
}
