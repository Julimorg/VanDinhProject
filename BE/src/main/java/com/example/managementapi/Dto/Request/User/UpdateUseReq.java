package com.example.managementapi.Dto.Request.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUseReq {

    @Size(min = 2, message = "USER_FIRSTNAME_INVALID")
    private String firstName;
    @Size(min = 2, message = "USER_LASTNAME_INVALID")
    private String lastName;
    @Size(min = 2, message = "USERNAME_INVALID")
    private String userName;
    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}",message = "EMAIL_INVALID")
    private String email;
    @Size(min = 2, max = 10, message = "PHONE_INVALID")
    private String phone;

    private MultipartFile userImg;

    private LocalDate userDob;
    private String userAddress;

}
