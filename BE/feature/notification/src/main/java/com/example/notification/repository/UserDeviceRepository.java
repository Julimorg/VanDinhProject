package com.example.notification.repository;

import com.example.persistence.entity.UserDevice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserDeviceRepository extends JpaRepository<UserDevice, String> {

    Optional<UserDevice> findFirstByUserIdAndSocketIdIsNotNull(String userId);

    Optional<UserDevice> findByUserId(String userId);
}
