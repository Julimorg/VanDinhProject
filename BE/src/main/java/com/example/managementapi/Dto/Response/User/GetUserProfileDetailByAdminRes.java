package com.example.managementapi.Dto.Response.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetUserProfileDetailByAdminRes {
    private String id;
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String phone;
    private String userAddress;
    private String userDob;
    private String userImg;

    private String status;

    private Set<RoleInGetUserRes> roles;

    private List<OrderInGetUserDetailByAdminRes> orders;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
