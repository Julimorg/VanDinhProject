package com.example.managementapi.Repository;

import com.example.managementapi.Entity.UserDevice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserDeviceRepository extends JpaRepository<UserDevice, String> {

    Optional<UserDevice> findFirstByUserIdAndSocketIdIsNotNull(String userId);
    void deleteBySocketId(String socketId);
}
