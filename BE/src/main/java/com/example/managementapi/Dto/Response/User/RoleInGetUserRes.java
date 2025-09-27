package com.example.managementapi.Dto.Response.User;

import com.example.managementapi.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleInGetUserRes {
    private String name;
    private String description;
}
