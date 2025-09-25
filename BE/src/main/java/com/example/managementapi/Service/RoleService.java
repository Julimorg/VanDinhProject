package com.example.managementapi.Service;

import com.example.managementapi.Dto.Request.Role.CreateRoleReq;
import com.example.managementapi.Dto.Response.Role.CreateRoleRes;
import com.example.managementapi.Dto.Response.Role.RoleRes;
import com.example.managementapi.Mapper.RoleMapper;
import com.example.managementapi.Repository.PermissionRepository;
import com.example.managementapi.Repository.RoleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleService {

    private final RoleMapper roleMapper;

    private final PermissionRepository permissionRepository;

    private final RoleRepository roleRespository;

    public CreateRoleRes createRole(CreateRoleReq request){
        var role = roleMapper.toCreateRole(request);

        var permission = permissionRepository.findAllById(request.getPermissions());

        role.setPermissions(new HashSet<>(permission));


        role =  roleRespository.save(role);

       return roleMapper.toCreateRoleRes(role);
    }

    public List<RoleRes> getRole(){
        var roles = roleRespository.findAll();

        return roles.stream().map(roleMapper::toRoleResponse).toList();
    }

    @Transactional
    public void deleteRole(String roleName){
        if(!roleRespository.existsByName(roleName)){
            throw new RuntimeException("Role Name not found:  " +  roleName);
        }
        roleRespository.deleteByName(roleName);
    }
}
