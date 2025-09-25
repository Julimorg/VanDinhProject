package com.example.managementapi.Dto.Response.Role;

import com.example.managementapi.Dto.Response.Permission.GetPermissionRes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleRes {
    private String name;
    private String description;


    List<GetPermissionRes> permissions;
}
