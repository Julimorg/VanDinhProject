package com.example.managementapi.Dto.Response.User;


import com.example.managementapi.Entity.Role;
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
public class SearchByUserRes {
    private String id;
    private String userName;
    private String email;
    private String userImg;
    private String status;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

}
