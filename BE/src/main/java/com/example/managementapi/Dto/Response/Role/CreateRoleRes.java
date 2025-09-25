package com.example.managementapi.Dto.Response.Role;

import com.example.managementapi.Dto.Response.Permission.GetPermissionRes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRoleRes {
    private String name;
    private String description;


    List<GetPermissionRes> permissions;

    private LocalDateTime createAt;
}
