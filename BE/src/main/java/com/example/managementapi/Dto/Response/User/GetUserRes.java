package com.example.managementapi.Dto.Response.User;

import com.example.managementapi.Entity.Role;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetUserRes {
    private String id;
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String phone;
    private String userDob;
    private String userAddress;
    private String userImg;
    private Set<Role> roles;
    private String status;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;

}
