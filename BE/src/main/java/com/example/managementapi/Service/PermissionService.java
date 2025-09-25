package com.example.managementapi.Service;

import com.example.managementapi.Dto.Request.Permission.CreatePermissionReq;
import com.example.managementapi.Dto.Response.Permission.CreatePermissionRes;
import com.example.managementapi.Dto.Response.Permission.GetPermissionRes;
import com.example.managementapi.Mapper.PermissionMapper;
import com.example.managementapi.Repository.PermissionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionService {

    @Autowired
    private final PermissionRepository permissionRepository;

    @Autowired
    private final PermissionMapper permissionMapper;

    public CreatePermissionRes createPermission(CreatePermissionReq request)
    {
        var permission = permissionMapper.toCreatePermission(request);

        permission = permissionRepository.save(permission);

        return permissionMapper.toCreatePermissionResponse(permission);
    }


    public List<GetPermissionRes> getPermission(){
        var permission = permissionRepository.findAll();

        return permission.stream().map(permissionMapper::toGetPermission).toList();
    }

    @Transactional
    public void deletePermission(String permissionName){
        if (!permissionRepository.existsByName(permissionName)) {
            throw new RuntimeException("Permission not found: " + permissionName);
        }
        permissionRepository.deleteByName(permissionName);
    }
}
