package com.example.managementapi.Dto.Response.Auth;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshRes {
    private String accessToken;
    private boolean authenticated;
}
