package com.example.managementapi.Dto.Request.User.ForgetPass;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePassword {
    @Size(min = 5, max = 20, message = "USER_PASSWORD_INVALID")
    private String password;
    private String newPassword;
}
