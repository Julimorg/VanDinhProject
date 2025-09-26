package com.example.managementapi.Dto.Request.Auth;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SignUpReq {

    @Size(min = 2, max = 20, message = "USER_FIRSTNAME_INVALID")
    private String firstName;
    @Size(min = 2, max = 20, message = "USER_LASTNAME_INVALID")
    private String lastName;
    @Size(min = 2, max = 20, message = "USERNAME_INVALID")
    private String userName;
    @Size(min = 5, max = 20, message = "USER_PASSWORD_INVALID")
    private String password;
    @Size(min = 2, max = 20, message = "EMAIL_INVALID")
    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}", message = "EMAIL_INVALID")
    private String email;
    @Size(min = 2, max = 10, message = "PHONE_INVALID")
    private String phone;
    private LocalDate userDob;
    private String userAddress;
}
