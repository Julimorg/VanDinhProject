package com.example.managementapi.Repository;

import com.example.managementapi.Entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    void deleteByName(String name);

    Optional<Role> findByName(String name);


    boolean existsByName(String name);
}
