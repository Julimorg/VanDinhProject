package com.example.managementapi.Dto.Response.User;

import com.example.managementapi.Dto.Response.Role.RoleRes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateStaffRes {
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

    private Set<RoleRes> roles;

    private LocalDateTime createAt;
}
