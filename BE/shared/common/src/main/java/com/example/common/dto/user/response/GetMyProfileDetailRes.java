package com.example.common.dto.user.response;

import com.example.common.dto.order.response.GetMyOrderDetailRes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetMyProfileDetailRes {
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

    private List<GetMyOrderDetailRes> orders;

    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
