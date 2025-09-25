package com.example.managementapi.Repository;

import com.example.managementapi.Entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {

    void deleteByName(String permissionName);

    boolean existsByName(String permissionName);
}
