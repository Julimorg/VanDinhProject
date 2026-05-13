package com.example.common.dto.notification.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SendNotiToOneUserOrManyUserReq {

    private List<String> userId;

    private String title;

    private String message;

    private String type;

    private String createBy;
}
