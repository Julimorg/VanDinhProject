package com.example.managementapi.Dto.Response.Permission;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePermissionRes {
    private String name;
    private String description;

    private LocalDateTime createAt;
}
