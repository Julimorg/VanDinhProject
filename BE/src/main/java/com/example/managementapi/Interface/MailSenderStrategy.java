package com.example.managementapi.Interface;

import com.example.managementapi.Enum.MailProvider;

public interface MailSenderStrategy {

    boolean supports(MailProvider provider);

}
