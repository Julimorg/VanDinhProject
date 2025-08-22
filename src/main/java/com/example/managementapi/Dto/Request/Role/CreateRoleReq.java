package com.example.managementapi.Dto.Request.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRoleReq {
    private String roleName;
    private String roleDescription;

    List<String> permissions;
}
