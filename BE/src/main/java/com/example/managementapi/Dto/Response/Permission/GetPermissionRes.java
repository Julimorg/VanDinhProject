package com.example.managementapi.Dto.Response.Permission;

import com.example.managementapi.Entity.Role;
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
public class GetPermissionRes {
    private String name;
    private String description;


    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
