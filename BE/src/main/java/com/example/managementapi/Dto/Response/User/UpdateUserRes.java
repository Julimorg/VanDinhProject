package com.example.managementapi.Dto.Response.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRes {
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
