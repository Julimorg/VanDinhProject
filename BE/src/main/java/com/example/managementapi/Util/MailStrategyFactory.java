package com.example.managementapi.Util;

import com.example.managementapi.Enum.MailProvider;
import com.example.managementapi.Interface.MailSenderStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MailStrategyFactory {

    private final List<MailSenderStrategy> strategies;

    public MailSenderStrategy getStrategy(MailProvider provider) {
        return strategies.stream()
                .filter(s -> s.supports(provider))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Provider can not support: " + provider));
    }
}
