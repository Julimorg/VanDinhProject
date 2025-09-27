package com.example.managementapi.Dto.Request.User;

import com.example.managementapi.Entity.Role;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateUserReq {

    @Size(min = 2, message = "USER_FIRSTNAME_INVALID")
    private String firstName;
    @Size(min = 2, message = "USER_LASTNAME_INVALID")
    private String lastName;
    @Size(min = 2, message = "USERNAME_INVALID")
    private String userName;
    @Size(min = 5, max = 20, message = "USER_PASSWORD_INVALID")
    private String password;
    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}",message = "EMAIL_INVALID")
    private String email;
    @Size(min = 2, max = 10, message = "PHONE_INVALID")

    private String phone;

    private MultipartFile userImg;

    private String roles;


    private LocalDate userDob;
    private String userAddress;
}
