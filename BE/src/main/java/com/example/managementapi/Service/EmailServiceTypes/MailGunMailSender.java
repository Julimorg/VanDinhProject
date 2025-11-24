package com.example.managementapi.Service.EmailServiceTypes;

import com.example.managementapi.Configuration.MailPropertiesConfiguration;
import com.example.managementapi.Enum.MailProvider;
import com.example.managementapi.Interface.MailSenderStrategy;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailGunMailSender implements MailSenderStrategy {

    private final MailPropertiesConfiguration props;


    @Override
    public boolean supports(MailProvider provider) {
        return provider == MailProvider.MAILGUN;
    }

    @Override
    public void send(MimeMessage message) throws Exception {

    }
}
