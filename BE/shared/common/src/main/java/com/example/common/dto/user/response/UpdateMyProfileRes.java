package com.example.common.dto.user.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMyProfileRes {
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String phone;
    private LocalDate userDob;
    private String userAddress;

    private String userImg;

    private LocalDateTime updateAt;

}
