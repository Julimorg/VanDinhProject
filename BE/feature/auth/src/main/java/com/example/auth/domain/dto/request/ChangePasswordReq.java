package com.example.auth.domain.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePasswordReq{
    @Size(min = 5, max = 20, message = "USER_PASSWORD_INVALID")
    private String password;
    private String newPassword;
}
