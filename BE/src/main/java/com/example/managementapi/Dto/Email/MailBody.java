package com.example.managementapi.Dto.Email;
import lombok.Builder;


//** String to -> Chỉ rõ user cần được gửi mail
//** String subject -> Là tiêu đề của Mail
//** String text -> Content trong mail
@Builder
public record MailBody(String to, String subject, String text) {

}
