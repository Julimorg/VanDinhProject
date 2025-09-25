package com.example.managementapi.Dto.Response.User;


import com.example.managementapi.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchByUserRes {
    private String id;
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String phone;
    private String userDob;
    private String userAddress;
    private String userImg;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;

}
