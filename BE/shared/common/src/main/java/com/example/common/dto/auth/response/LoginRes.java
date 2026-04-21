package com.example.common.dto.auth.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRes {
    private String id;
    private String userName;
    private String email;
    private String userImg;
    private String accessToken;
    private String refreshToken;
    boolean authenticated;
}
