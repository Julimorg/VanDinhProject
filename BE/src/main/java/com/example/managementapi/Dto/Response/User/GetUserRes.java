package com.example.managementapi.Dto.Response.User;

import com.example.managementapi.Entity.Role;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetUserRes {
    private String id;
    private String userName;
    private String email;
    private String userImg;
    private String status;
    private List<RoleInGetUserRes> roles;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

}
