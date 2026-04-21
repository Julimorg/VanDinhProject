package com.example.common.dto.user.response;

import com.example.common.dto.order.response.GetUserOrdeDetailRes;
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
public class GetUserProfileRes {
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

    private List<GetUserOrdeDetailRes> orders;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
