package com.example.managementapi.Util;

import com.example.managementapi.Enum.MailProvider;
import com.example.managementapi.Interface.DynamicTemplateMailSender;
import com.example.managementapi.Interface.MailSenderStrategy;
import com.example.managementapi.Interface.MimeMessageMailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MailStrategyFactory {

    private final List<MailSenderStrategy> strategies;

    public MimeMessageMailSender getMimeSender(MailProvider provider) {
        return strategies.stream()
                .filter(s -> s instanceof MimeMessageMailSender && s.supports(provider))
                .map(s -> (MimeMessageMailSender) s)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy MimeMessage sender cho: " + provider));
    }

    public DynamicTemplateMailSender getDynamicSender(MailProvider provider) {
        return strategies.stream()
                .filter(s -> s instanceof DynamicTemplateMailSender && s.supports(provider))
                .map(s -> (DynamicTemplateMailSender) s)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy Dynamic Template sender cho: " + provider));
    }
}
