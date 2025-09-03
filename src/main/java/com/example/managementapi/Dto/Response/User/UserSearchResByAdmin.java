package com.example.managementapi.Dto.Response.User;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchResByAdmin {
    private String id;
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String phone;
    private String userDob;
    private String userAddress;
    private String userImg;
    private String isActive;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;

}
