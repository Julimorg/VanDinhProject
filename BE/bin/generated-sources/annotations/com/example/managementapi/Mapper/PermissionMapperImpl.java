package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Permission.CreatePermissionReq;
import com.example.managementapi.Dto.Response.Permission.CreatePermissionRes;
import com.example.managementapi.Dto.Response.Permission.GetPermissionRes;
import com.example.managementapi.Entity.Permission;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-10T10:06:49+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class PermissionMapperImpl implements PermissionMapper {

    @Override
    public Permission toCreatePermission(CreatePermissionReq request) {
        if ( request == null ) {
            return null;
        }

        Permission.PermissionBuilder permission = Permission.builder();

        permission.description( request.getDescription() );
        permission.name( request.getName() );

        return permission.build();
    }

    @Override
    public CreatePermissionRes toCreatePermissionResponse(Permission permission) {
        if ( permission == null ) {
            return null;
        }

        CreatePermissionRes.CreatePermissionResBuilder createPermissionRes = CreatePermissionRes.builder();

        createPermissionRes.createAt( permission.getCreateAt() );
        createPermissionRes.description( permission.getDescription() );
        createPermissionRes.name( permission.getName() );

        return createPermissionRes.build();
    }

    @Override
    public GetPermissionRes toGetPermission(Permission permission) {
        if ( permission == null ) {
            return null;
        }

        GetPermissionRes.GetPermissionResBuilder getPermissionRes = GetPermissionRes.builder();

        getPermissionRes.createAt( permission.getCreateAt() );
        getPermissionRes.description( permission.getDescription() );
        getPermissionRes.name( permission.getName() );
        getPermissionRes.updateAt( permission.getUpdateAt() );

        return getPermissionRes.build();
    }
}
