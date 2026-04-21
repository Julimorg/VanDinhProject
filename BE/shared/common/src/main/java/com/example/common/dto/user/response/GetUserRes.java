package com.example.common.dto.user.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetUserRes {
    private String id;
    private String userName;
    private String firstName;
    private String lastName;
    private String phone;
    private String userAddress;
    private LocalDate userDob;
    private String email;
    private String userImg;
    private String status;
    private List<GetUserRoleRes> roles;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

}
