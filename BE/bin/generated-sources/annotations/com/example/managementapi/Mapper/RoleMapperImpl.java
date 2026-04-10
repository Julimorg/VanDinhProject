package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Role.CreateRoleReq;
import com.example.managementapi.Dto.Response.Permission.GetPermissionRes;
import com.example.managementapi.Dto.Response.Role.CreateRoleRes;
import com.example.managementapi.Dto.Response.Role.RoleRes;
import com.example.managementapi.Entity.Permission;
import com.example.managementapi.Entity.Role;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-10T10:06:46+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class RoleMapperImpl implements RoleMapper {

    @Override
    public Role toCreateRole(CreateRoleReq request) {
        if ( request == null ) {
            return null;
        }

        Role.RoleBuilder role = Role.builder();

        role.description( request.getDescription() );
        role.name( request.getName() );

        return role.build();
    }

    @Override
    public CreateRoleRes toCreateRoleRes(Role role) {
        if ( role == null ) {
            return null;
        }

        CreateRoleRes.CreateRoleResBuilder createRoleRes = CreateRoleRes.builder();

        createRoleRes.createAt( role.getCreateAt() );
        createRoleRes.description( role.getDescription() );
        createRoleRes.name( role.getName() );
        createRoleRes.permissions( permissionSetToGetPermissionResList( role.getPermissions() ) );

        return createRoleRes.build();
    }

    @Override
    public RoleRes toRoleResponse(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleRes.RoleResBuilder roleRes = RoleRes.builder();

        roleRes.description( role.getDescription() );
        roleRes.name( role.getName() );
        roleRes.permissions( permissionSetToGetPermissionResList( role.getPermissions() ) );

        return roleRes.build();
    }

    protected GetPermissionRes permissionToGetPermissionRes(Permission permission) {
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

    protected List<GetPermissionRes> permissionSetToGetPermissionResList(Set<Permission> set) {
        if ( set == null ) {
            return null;
        }

        List<GetPermissionRes> list = new ArrayList<GetPermissionRes>( set.size() );
        for ( Permission permission : set ) {
            list.add( permissionToGetPermissionRes( permission ) );
        }

        return list;
    }
}
