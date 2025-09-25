package com.example.managementapi.Mapper;


import com.example.managementapi.Dto.Request.Permission.CreatePermissionReq;
import com.example.managementapi.Dto.Response.Permission.CreatePermissionRes;
import com.example.managementapi.Dto.Response.Permission.GetPermissionRes;
import com.example.managementapi.Entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {

    Permission toCreatePermission(CreatePermissionReq request);

    CreatePermissionRes toCreatePermissionResponse(Permission permission);


    GetPermissionRes toGetPermission (Permission permission);

}
