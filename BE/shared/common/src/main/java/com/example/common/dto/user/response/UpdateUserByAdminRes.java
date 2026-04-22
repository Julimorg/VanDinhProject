package com.example.common.dto.user.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserByAdminRes {
    private String firstName;
    private String lastName;
    private String userName;
    private String email;
    private String phone;
    private LocalDate userDob;
    private String userAddress;
    private Set<GetUserRoleRes> roles;
    private String status;

    private String userImg;

    private LocalDateTime updateAt;

}
